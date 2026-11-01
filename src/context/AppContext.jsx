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
          loadPots();
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user);
          loadPots();
        } else {
          setCurrentUser(null);
          setPots([]);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline fallback mode
      const cached = localStorage.getItem('little_pots_auth_user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setCurrentUser(parsed);
          setSession({ user: { id: parsed.id } });
          loadLocalPots();
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
          name: data.username || authUser.email.split('@')[0],
          email: authUser.email,
          bio: data.bio || '',
          stampPreference: data.stamp_preference || '🌿 Cedar Leaf',
          createdAt: data.created_at
        });
      } else {
        const fallbackName = authUser.email.split('@')[0];
        await supabase.from('profiles').upsert({
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

  // Load all pots for the Public Wall
  const loadPots = async () => {
    try {
      // 1. Fetch all pots
      const { data: potsData, error: potsErr } = await supabase
        .from('pots')
        .select('*')
        .order('created_at', { ascending: false });

      if (potsErr) {
        console.error("Error fetching pots:", potsErr);
        return;
      }

      if (!potsData || potsData.length === 0) {
        setPots([]);
        return;
      }

      // 2. Fetch all profiles to map usernames
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, username');
      
      const userMap = {};
      (profs || []).forEach(pr => {
        userMap[pr.id] = pr.username;
      });

      // 3. Fetch all replies
      const { data: repliesData } = await supabase
        .from('pot_replies')
        .select('*')
        .order('created_at', { ascending: true });

      const repliesByPot = {};
      (repliesData || []).forEach(r => {
        if (!repliesByPot[r.pot_id]) repliesByPot[r.pot_id] = [];
        repliesByPot[r.pot_id].push({
          id: r.id,
          potId: r.pot_id,
          authorId: r.author_id,
          authorName: userMap[r.author_id] || 'Stranger',
          content: r.content,
          createdAt: r.created_at
        });
      });

      const formatted = potsData.map(p => ({
        id: p.id,
        senderId: p.sender_id,
        senderName: userMap[p.sender_id] || 'Anonymous Wanderer',
        title: p.title,
        content: p.content,
        stamp: p.stamp,
        createdAt: p.created_at,
        replies: repliesByPot[p.id] || []
      }));

      setPots(formatted);
    } catch (err) {
      console.error("Error loading pots:", err);
    }
  };

  const loadLocalPots = () => {
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

  // Register
  const registerUser = async (email, password, username, stamp) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            username,
            stamp_preference: stamp || '🌿 Cedar Leaf'
          }
        }
      });
      if (error) throw error;

      if (data?.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username,
          stamp_preference: stamp || '🌿 Cedar Leaf'
        });
        await fetchUserProfile(data.user);
        await loadPots();
      }
      return data;
    } else {
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

  // Login
  const loginUser = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data?.user) {
        await fetchUserProfile(data.user);
        await loadPots();
      }
      return data;
    } else {
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

  // Cast pot to the public wall
  const castPot = async ({ title, content, stamp }) => {
    const potTitle = title.trim() || 'Untitled Letter';
    const potContent = content.trim();
    const potStamp = stamp || currentUser?.stampPreference || '🌿 Cedar Leaf';

    if (isSupabaseConfigured && supabase && currentUser) {
      const { error: insErr } = await supabase.from('pots').insert({
        sender_id: currentUser.id,
        title: potTitle,
        content: potContent,
        stamp: potStamp
      });

      if (insErr) {
        console.error("Cast pot error:", insErr);
        throw insErr;
      }

      await loadPots();
    } else if (currentUser) {
      const newPot = {
        id: 'pot_' + Date.now().toString(36),
        senderId: currentUser.id,
        senderName: currentUser.name,
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

  // Reply to any pot
  const replyToPot = async (potId, replyText) => {
    if (!replyText.trim() || !currentUser) return;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('pot_replies').insert({
        pot_id: potId,
        author_id: currentUser.id,
        content: replyText.trim()
      });
      if (error) {
        console.error("Reply error:", error);
        throw error;
      }
      await loadPots();
    } else {
      const newReply = {
        id: 'rep_' + Date.now().toString(36),
        potId,
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
      playTypewriterSound,
      refreshPots: loadPots
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
