import { db } from './firebase';
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

import React, { useEffect, useState } from 'react';
import './App.scss';
import { auth } from './firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';

import AuthScreen from './AuthScreen';
import PlantForm from './PlantForm';
import PlantCard from './PlantCard';

function App() {
	const [plants, setPlants] = useState([]);
	const [loadingPlants, setLoadingPlants] = useState(true);

	const [name, setName] = useState('');
	const [photo, setPhoto] = useState(null);
	const [acquiredAt, setAcquiredAt] = useState('');
	const [editingId, setEditingId] = useState(null);
	const [editPlant, setEditPlant] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');

	const [user, setUser] = useState(null);
	const [authMode, setAuthMode] = useState('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [authError, setAuthError] = useState('');

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
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser || null);
		});
		return () => unsubscribe();
	}, []);

	const handleRegister = async (e) => {
		e.preventDefault();
		setAuthError('');
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			setEmail('');
			setPassword('');
		} catch (err) {
			setAuthError(err.message);
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setAuthError('');
		try {
			await signInWithEmailAndPassword(auth, email, password);
			setEmail('');
			setPassword('');
		} catch (err) {
			setAuthError(err.message);
		}
	};

	const handleLogout = async () => {
		await signOut(auth);
	};

	const resizeImageTo100px = (file, callback) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const MAX_WIDTH = 100;
				const scale = MAX_WIDTH / img.width;
				const width = MAX_WIDTH;
				const height = img.height * scale;

				if (!img.width) return;

				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, width, height);

				const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
				callback(dataUrl);
			};
			img.src = e.target.result;
		};

		reader.readAsDataURL(file);
	}

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		resizeImageTo100px(file, setPhoto);
	};

	const handleAddPlant = async (e) => {
		e.preventDefault();
		if (name.trim() === '' || !user) return;

		const newPlant = {
			name,
			photo,
			acquiredAt,
			wateringLog: [],
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
		const newLog = [...(wateringLog || []), new Date().toISOString()];
		const plantRef = doc(db, 'plants', id);
		await updateDoc(plantRef, { wateringLog: newLog });
	};

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
		resizeImageTo100px(file, (dataUrl) =>
			setEditPlant({ ...editPlant, photo: dataUrl })
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

	if (!user) {
		return (
			<AuthScreen
				authMode={authMode}
				setAuthMode={setAuthMode}
				email={email}
				password={password}
				setEmail={setEmail}
				setPassword={setPassword}
				authError={authError}
				handleLogin={handleLogin}
				handleRegister={handleRegister}
			/>
		);
	}
	return (
		<div className='mainBlock'>
			<h1>🌿 Мои растения</h1>

			<button className='btn btnLogOut' onClick={handleLogout}>
				Выйти
			</button>

			<input
				className='searchInput'
				type='text'
				placeholder='Поиск по названию'
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			<PlantForm
				name={name}
				acquiredAt={acquiredAt}
				onNameChange={setName}
				onDateChange={setAcquiredAt}
				onPhotoChange={handlePhotoChange}
				onSubmit={handleAddPlant}
			/>

			{loadingPlants && (
				<p className='startMessage'>Загружаем ваши растения…</p>
			)}

			<div className='plantListWrap'>
				<div className='plantListWrap'>
					{filteredPlants.map((plant) => (
						<PlantCard
							key={plant.id}
							plant={plant}
							editingId={editingId}
							editPlant={editPlant}
							startEditPlant={startEditPlant}
							saveEditPlant={saveEditPlant}
							cancelEdit={cancelEdit}
							handleWaterPlant={handleWaterPlant}
							handleEditPhotoChange={handleEditPhotoChange}
							handleDeletePlant={handleDeletePlant}  // ← добавить
							formatDate={formatDate}
							getLastWatering={getLastWatering}
						/>
					))}
				</div>
			</div>

			{!loadingPlants && plants.length === 0 && (
				<p className='startMessage'>Добавьте первое растение!</p>
			)}
		</div>
	);
}

export default App;
