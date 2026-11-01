import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { RANDOM_USERNAMES, VINTAGE_STAMPS } from '../lib/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [pots, setPots] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Initialize Auth state
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user);
          loadPots(session.user.id);
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user);
          loadPots(session.user.id);
        } else {
          setCurrentUser(null);
          setPots([]);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Local fallback session check
      const cached = localStorage.getItem('little_pots_auth_user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setCurrentUser(parsed);
          setSession({ user: { id: parsed.id } });
          loadLocalPots(parsed.id);
        } catch (e) {}
      }
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setCurrentUser({
          id: data.id,
          name: data.username,
          email: authUser.email,
          bio: data.bio || '',
          stampPreference: data.stamp_preference || '🌿 Cedar Leaf',
          createdAt: data.created_at
        });
      } else {
        // Create default profile if not present
        const fallbackName = authUser.email.split('@')[0];
        await supabase.from('profiles').insert({
          id: authUser.id,
          username: fallbackName,
          stamp_preference: '🌿 Cedar Leaf'
        });
        setCurrentUser({
          id: authUser.id,
          name: fallbackName,
          email: authUser.email,
          bio: '',
          stampPreference: '🌿 Cedar Leaf',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPots = async (userId) => {
    try {
      const { data, error } = await supabase
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

      if (data) {
        const formatted = data.map(p => ({
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
      console.error("Error loading pots:", err);
    }
  };

  const loadLocalPots = (userId) => {
    const saved = localStorage.getItem('little_pots_items');
    if (saved) {
      try {
        setPots(JSON.parse(saved));
      } catch (e) {
        setPots([]);
      }
    } else {
      setPots([]);
    }
  };

  // Register new user
  const registerUser = async (email, password, username, stamp) => {
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
          username,
          stamp_preference: stamp || '🌿 Cedar Leaf'
        });
      }
      return data;
    } else {
      // Local fallback mode
      const localId = 'usr_' + Date.now().toString(36);
      const userObj = {
        id: localId,
        name: username,
        email,
        bio: '',
        stampPreference: stamp || '🌿 Cedar Leaf',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('little_pots_auth_user', JSON.stringify(userObj));
      setCurrentUser(userObj);
      setSession({ user: { id: localId } });
      return { user: userObj };
    }
  };

  // Login existing user
  const loginUser = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } else {
      // Local fallback mode
      const localId = 'usr_' + Date.now().toString(36);
      const userObj = {
        id: localId,
        name: email.split('@')[0],
        email,
        bio: '',
        stampPreference: '🌿 Cedar Leaf',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('little_pots_auth_user', JSON.stringify(userObj));
      setCurrentUser(userObj);
      setSession({ user: { id: localId } });
      return { user: userObj };
    }
  };

  // Sign out
  const logoutUser = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('little_pots_auth_user');
    setCurrentUser(null);
    setSession(null);
    setPots([]);
  };

  // Cast pot
  const castPot = async ({ title, content, stamp }) => {
    const potTitle = title.trim() || 'Untitled Letter';
    const potContent = content.trim();
    const potStamp = stamp || currentUser?.stampPreference || '🌿 Cedar Leaf';

    if (isSupabaseConfigured && supabase && currentUser) {
      const { data, error } = await supabase.rpc('cast_random_pot', {
        p_title: potTitle,
        p_content: potContent,
        p_stamp: potStamp
      });
      if (error) {
        // Fallback standard insert if RPC has issues
        await supabase.from('pots').insert({
          sender_id: currentUser.id,
          title: potTitle,
          content: potContent,
          stamp: potStamp
        });
      }
      await loadPots(currentUser.id);
    } else if (currentUser) {
      const newPot = {
        id: 'pot_' + Date.now().toString(36),
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: 'stranger_peer',
        title: potTitle,
        content: potContent,
        stamp: potStamp,
        createdAt: new Date().toISOString(),
        replies: []
      };
      const updated = [newPot, ...pots];
      setPots(updated);
      localStorage.setItem('little_pots_items', JSON.stringify(updated));
    }
  };

  // Reply to pot
  const replyToPot = async (potId, replyText) => {
    if (!replyText.trim() || !currentUser) return;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('pot_replies').insert({
        pot_id: potId,
        author_id: currentUser.id,
        content: replyText.trim()
      });
      if (error) throw error;
      await loadPots(currentUser.id);
    } else {
      const newReply = {
        id: 'rep_' + Date.now().toString(36),
        authorId: currentUser.id,
        authorName: currentUser.name,
        content: replyText.trim(),
        createdAt: new Date().toISOString()
      };
      const updated = pots.map(p => {
        if (p.id === potId) {
          return { ...p, replies: [...(p.replies || []), newReply] };
        }
        return p;
      });
      setPots(updated);
      localStorage.setItem('little_pots_items', JSON.stringify(updated));
    }
  };

  // Update profile
  const updateProfile = async (name, bio, stampPreference) => {
    if (!currentUser) return;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').update({
        username: name.trim(),
        bio: bio.trim(),
        stamp_preference: stampPreference
      }).eq('id', currentUser.id);
    }

    const updated = {
      ...currentUser,
      name: name.trim(),
      bio: bio.trim(),
      stampPreference
    };
    setCurrentUser(updated);
    localStorage.setItem('little_pots_auth_user', JSON.stringify(updated));
  };

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

  return (
    <AppContext.Provider value={{
      currentUser,
      session,
      pots,
      loading,
      loginUser,
      registerUser,
      logoutUser,
      castPot,
      replyToPot,
      updateProfile,
      audioEnabled,
      setAudioEnabled,
      playTypewriterSound
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
