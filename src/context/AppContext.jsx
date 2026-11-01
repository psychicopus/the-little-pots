import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COMMUNITY_POTS, RANDOM_USERNAMES, VINTAGE_STAMPS } from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Session & Auth state
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('little_pots_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    const defaultName = RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
    return {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      name: defaultName,
      email: null,
      bio: "A traveler seeking quiet words and honest thoughts.",
      stampPreference: VINTAGE_STAMPS[0],
      createdAt: new Date().toISOString(),
      isRegistered: false
    };
  });

  // Pots collection
  const [pots, setPots] = useState(() => {
    const saved = localStorage.getItem('little_pots_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_COMMUNITY_POTS;
  });

  // Sound preference
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Sync Supabase Auth listener if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchSupabaseProfile(session.user);
        loadSupabasePots(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchSupabaseProfile(session.user);
        loadSupabasePots(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Supabase user profile
  const fetchSupabaseProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setCurrentUser({
          id: data.id,
          name: data.username || authUser.email?.split('@')[0],
          email: authUser.email,
          bio: data.bio || '',
          stampPreference: data.stamp_preference || VINTAGE_STAMPS[0],
          createdAt: data.created_at,
          isRegistered: true
        });
      }
    } catch (err) {
      console.warn("Could not fetch remote profile:", err);
    }
  };

  // Load pots from Supabase
  const loadSupabasePots = async (userId) => {
    try {
      const { data: potsData, error } = await supabase
        .from('pots')
        .select(`
          id,
          title,
          content,
          stamp,
          status,
          created_at,
          sender_id,
          recipient_id,
          sender:profiles!pots_sender_id_fkey(username),
          replies:pot_replies(
            id,
            content,
            created_at,
            author_id,
            author:profiles!pot_replies_author_id_fkey(username)
          )
        `)
        .order('created_at', { ascending: false });

      if (potsData && potsData.length > 0) {
        const formatted = potsData.map(p => ({
          id: p.id,
          senderId: p.sender_id,
          senderName: p.sender?.username || 'Anonymous Wanderer',
          recipientId: p.recipient_id,
          title: p.title,
          content: p.content,
          stamp: p.stamp,
          createdAt: p.created_at,
          replies: (p.replies || []).map(r => ({
            id: r.id,
            authorId: r.author_id,
            authorName: r.author?.username || 'Stranger',
            content: r.content,
            createdAt: r.created_at
          }))
        }));
        setPots(formatted);
      }
    } catch (err) {
      console.warn("Could not fetch remote pots:", err);
    }
  };

  // Cache user to localStorage
  useEffect(() => {
    localStorage.setItem('little_pots_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Cache pots to localStorage
  useEffect(() => {
    localStorage.setItem('little_pots_items', JSON.stringify(pots));
  }, [pots]);

  // Register user (supports both Supabase cloud and simulated local session)
  const register = async (email, password, username, stampPreference) => {
    setAuthError(null);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      if (error) throw error;

      if (data?.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: username,
          stamp_preference: stampPreference || VINTAGE_STAMPS[0]
        });
      }
    }

    // Update state & cache
    const userObj = {
      id: session?.user?.id || 'reg_' + Math.random().toString(36).substring(2, 9),
      name: username,
      email: email,
      bio: "A registered wanderer with an active postal desk.",
      stampPreference: stampPreference || VINTAGE_STAMPS[0],
      createdAt: new Date().toISOString(),
      isRegistered: true
    };
    setCurrentUser(userObj);
    return userObj;
  };

  // Login user
  const login = async (email, password) => {
    setAuthError(null);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data?.user) {
        await fetchSupabaseProfile(data.user);
      }
    } else {
      // Local fallback session
      setCurrentUser(prev => ({
        ...prev,
        email,
        name: email.split('@')[0],
        isRegistered: true
      }));
    }
  };

  // Sign out
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    const defaultName = RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
    const freshGuest = {
      id: 'guest_' + Math.random().toString(36).substring(2, 9),
      name: defaultName,
      email: null,
      bio: "A traveler seeking quiet words and honest thoughts.",
      stampPreference: VINTAGE_STAMPS[0],
      createdAt: new Date().toISOString(),
      isRegistered: false
    };
    setCurrentUser(freshGuest);
    setSession(null);
  };

  // Play mechanical typewriter click
  const playTypewriterSound = () => {
    if (!audioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 40, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  };

  // Cast a new pot
  const castPot = async ({ title, content, stamp }) => {
    const potPayload = {
      title: title.trim() || 'Untitled Dispatch',
      content: content.trim(),
      stamp: stamp || currentUser.stampPreference
    };

    // If Supabase is active, call RPC or table insert
    if (isSupabaseConfigured && supabase && session?.user) {
      try {
        const { data, error } = await supabase.rpc('cast_random_pot', {
          p_title: potPayload.title,
          p_content: potPayload.content,
          p_stamp: potPayload.stamp
        });
        if (!error && data) {
          loadSupabasePots(session.user.id);
          return;
        }
      } catch (err) {
        console.warn("Supabase pot cast fallback:", err);
      }
    }

    // Local simulation fallback
    const possibleRecipients = ['current_user', 'user_marcus', 'user_hazel', 'user_elena', 'user_stranger_82']
      .filter(id => id !== currentUser.id);
    const chosenRecipient = possibleRecipients[Math.floor(Math.random() * possibleRecipients.length)];

    const newPot = {
      id: 'pot_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: chosenRecipient,
      title: potPayload.title,
      content: potPayload.content,
      createdAt: new Date().toISOString(),
      stamp: potPayload.stamp,
      replies: []
    };

    setPots(prev => [newPot, ...prev]);
    return newPot;
  };

  // Reply to an existing pot
  const replyToPot = async (potId, replyText) => {
    if (!replyText.trim()) return;

    if (isSupabaseConfigured && supabase && session?.user) {
      try {
        await supabase.from('pot_replies').insert({
          pot_id: potId,
          author_id: session.user.id,
          content: replyText.trim()
        });
        loadSupabasePots(session.user.id);
        return;
      } catch (err) {
        console.warn("Supabase reply fallback:", err);
      }
    }

    const newReply = {
      id: 'reply_' + Date.now().toString(36),
      authorId: currentUser.id,
      authorName: currentUser.name,
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
    };

    setPots(prev => prev.map(p => {
      if (p.id === potId) {
        return {
          ...p,
          replies: [...(p.replies || []), newReply]
        };
      }
      return p;
    }));
  };

  const updateProfile = (name, bio, stampPreference) => {
    setCurrentUser(prev => ({
      ...prev,
      name: name.trim() || prev.name,
      bio: bio.trim(),
      stampPreference: stampPreference || prev.stampPreference
    }));
  };

  const switchIdentity = (newName) => {
    const freshId = 'user_' + Math.random().toString(36).substring(2, 9);
    setCurrentUser({
      id: freshId,
      name: newName || RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)],
      email: null,
      bio: "Another traveler wandering through the postal shelves.",
      stampPreference: VINTAGE_STAMPS[Math.floor(Math.random() * VINTAGE_STAMPS.length)],
      createdAt: new Date().toISOString(),
      isRegistered: false
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      session,
      pots,
      castPot,
      replyToPot,
      updateProfile,
      switchIdentity,
      register,
      login,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authError,
      audioEnabled,
      setAudioEnabled,
      playTypewriterSound,
      isSupabaseConfigured
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
