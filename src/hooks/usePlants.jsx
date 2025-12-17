import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

export function usePlants(user) {
  const [plants, setPlants] = useState([]);
  const [loadingPlants, setLoadingPlants] = useState(true);

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [acquiredAt, setAcquiredAt] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editPlant, setEditPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState(
    () => localStorage.getItem('plantsSortMode') || 'date'
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [noteTextByPlant, setNoteTextByPlant] = useState({});


  useEffect(() => {
    if (!user) {
      setPlants([]);
      setLoadingPlants(false);
      return;
    }

    setLoadingPlants(true);

    const plantsRef = collection(db, 'plants');
    const q = query(plantsRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPlants(data);
      setLoadingPlants(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('plantsSortMode', sortMode);
  }, [sortMode]);

  const resizeImageTo150px = (file, callback) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 150;
        const scale = MAX_WIDTH / img.width;
        const width = MAX_WIDTH;
        const height = img.height * scale;

        if (!img.width) return;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        callback(dataUrl);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  const handleAddPlant = async (e) => {
    e.preventDefault();
    if (name.trim() === '' || !user) return;

    const newPlant = {
      name,
      photo,
      acquiredAt,
      wateringLog: [],
      notes: [],
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'plants'), newPlant);

    setName('');
    setPhoto(null);
    setAcquiredAt('');
    e.target.reset();
  };

  const handleDeletePlant = async (id) => {
    await deleteDoc(doc(db, 'plants', id));
  };

  const handleWaterPlant = async (id, wateringLog) => {
    const prevLog = Array.isArray(wateringLog) ? wateringLog : [];
    const newEntry = new Date().toISOString();

    const extendedLog = [...prevLog, newEntry];

    const limitedLog =
      extendedLog.length > 8 ?
        extendedLog.slice(extendedLog.length - 8) :
        extendedLog;

    const plantRef = doc(db, 'plants', id);
    await updateDoc(plantRef, {
      wateringLog: limitedLog
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    resizeImageTo150px(file, setPhoto);
  };

  const addNoteToPlant = async (plantId, currentNotes, text) => {
    if (!text.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
    };

    const plantRef = doc(db, 'plants', plantId);
    const updatedNotes = [...(currentNotes || []), newNote];

    await updateDoc(plantRef, {
      notes: updatedNotes
    });
  };

  const deleteNoteFromPlant = async (plantId, currentNotes, noteId) => {
    const updatedNotes = (currentNotes || []).filter((note) => note.id !== noteId);
    const plantRef = doc(db, 'plants', plantId);
    await updateDoc(plantRef, {
      notes: updatedNotes
    });
  };

  const changeNoteText = (plantId, value) => {
    setNoteTextByPlant((prev) => ({
      ...prev,
      [plantId]: value
    }));
  }

  const startEditPlant = (plant) => {
    setEditingId(plant.id);
    setEditPlant({
      name: plant.name,
      acquiredAt: plant.acquiredAt || '',
      photo: plant.photo || null,
    });
  };

  const handleEditPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    resizeImageTo150px(file, (dataUrl) =>
      setEditPlant({
        ...editPlant,
        photo: dataUrl
      })
    );
  };

  const saveEditPlant = async (id) => {
    const plantRef = doc(db, 'plants', id);
    await updateDoc(plantRef, {
      name: editPlant.name,
      acquiredAt: editPlant.acquiredAt,
      photo: editPlant.photo,
    });

    setEditingId(null);
    setEditPlant(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPlant(null);
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('ru-RU');
  };

  const getLastWatering = (wateringLog) => {
    if (!wateringLog.length) return 'Ещё не поливали';
    return formatDate(wateringLog[wateringLog.length - 1]);
  };

  const filteredPlants = plants.filter((plant) =>
    (plant.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPlants = [...filteredPlants].sort((a, b) => {
    if (sortMode === 'name') {
      return a.name.localeCompare(b.name, 'ru', {
        sensitivity: 'base'
      });
    }

    const aDate = a.createdAt || a.acquiredAt || '';
    const bDate = b.createdAt || b.acquiredAt || '';
    return (bDate || '').localeCompare(aDate || '');
  });

  return {
    plants,
    loadingPlants,
    name,
    setName,
    photo,
    setPhoto,
    acquiredAt,
    setAcquiredAt,
    editingId,
    editPlant,
    searchQuery,
    setSearchQuery,
    sortMode,
    setSortMode,
    isAddModalOpen,
    setIsAddModalOpen,
    noteTextByPlant,

    handleAddPlant,
    handleDeletePlant,
    handleWaterPlant,
    handlePhotoChange,
    addNoteToPlant,
    deleteNoteFromPlant,
    changeNoteText,
    startEditPlant,
    handleEditPhotoChange,
    saveEditPlant,
    cancelEdit,
    formatDate,
    getLastWatering,
    sortedPlants,
  };
}