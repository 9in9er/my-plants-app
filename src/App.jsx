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
import './App.css';
import { auth } from './firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';

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

	const readFileAsDataUrl = (file, callback) => {
		const reader = new FileReader();
		reader.onloadend = () => callback(reader.result);
		reader.readAsDataURL(file);
	};

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) readFileAsDataUrl(file, setPhoto);
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
		if (file)
			readFileAsDataUrl(file, (dataUrl) =>
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
		plant.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (!user) {
		return (
			<div className='mainBlock'>
				<h1>🌿 Мои растения</h1>

				<div className='authToggle'>
					<button
						className={`btn ${authMode === 'login' ? 'btnSubmit' : ''}`}
						onClick={() => setAuthMode('login')}
					>
						Войти
					</button>
					<button
						className={`btn ${authMode === 'register' ? 'btnSubmit' : ''}`}
						onClick={() => setAuthMode('register')}
					>
						Регистрация
					</button>
				</div>

				<form
					className='authForm'
					onSubmit={authMode === 'login' ? handleLogin : handleRegister}
				>
					<input
						className='input inputLogin'
						type='email'
						placeholder='E-mail'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						className='input inputPass'
						type='password'
						placeholder='Пароль (мин. 6 символов)'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{authError && <p className='authError'>{authError}</p>}
					<button className='btn btnSubmit' type='submit'>
						{authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
					</button>
				</form>
			</div>
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

			<form className='mainForm' onSubmit={handleAddPlant}>
				<div className='mainForm_wrap'>
					<div className='nameAndDate'>
						<label className='nameLabel'>
							Название растения
							<input
								className='input plantName'
								type='text'
								placeholder='напр. алоказия фрайдек'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</label>
						<label className='dateLabel'>
							Дата появления
							<input
								className='plantDate'
								type='date'
								value={acquiredAt}
								onChange={(e) => setAcquiredAt(e.target.value)}
							/>
						</label>
					</div>
					<input
						className='fileLoad'
						type='file'
						accept='image/*'
						onChange={handlePhotoChange}
					/>
					<button className='btn btnSubmit' type='submit'>
						Добавить
					</button>
				</div>
			</form>

			{loadingPlants && (
				<p className='startMessage'>Загружаем ваши растения…</p>
			)}

			<div className='plantListWrap'>
				{filteredPlants.map((plant) => (
					<div className='plantWrap' key={plant.id}>
						{(editingId === plant.id ? editPlant?.photo : plant.photo) && (
							<img
								className='plantPhoto'
								src={editingId === plant.id ? editPlant?.photo : plant.photo}
								alt={
									editingId === plant.id ? editPlant?.name || plant.name : plant.name
								}
							/>
						)}

						<div className='plantInfo'>
							{editingId === plant.id ? (
								<>
									<input
										className='input plantName'
										type='text'
										value={editPlant.name}
										onChange={(e) =>
											setEditPlant({ ...editPlant, name: e.target.value })
										}
									/>
									<input
										className='plantDate'
										type='date'
										value={editPlant.acquiredAt}
										onChange={(e) =>
											setEditPlant({
												...editPlant,
												acquiredAt: e.target.value,
											})
										}
									/>
									<input
										className='fileLoad'
										type='file'
										accept='image/*'
										onChange={handleEditPhotoChange}
									/>
								</>
							) : (
								<>
									<h3 className='plantName'>{plant.name}</h3>
									<p>
										<strong>Последний полив: </strong>
										{getLastWatering(plant.wateringLog)}
									</p>
									{plant.acquiredAt && (
										<p>
											<strong>Дата появления: </strong>
											{new Date(plant.acquiredAt).toLocaleDateString('ru-RU')}
										</p>
									)}
									{plant.wateringLog.length > 0 && (
										<details>
											<summary>История поливов ({plant.wateringLog.length})</summary>
											<ul className='wateringList'>
												{plant.wateringLog.slice(-5).map((date, index) => (
													<li key={index}>{formatDate(date)}</li>
												))}
											</ul>
										</details>
									)}
								</>
							)}
						</div>

						<div className='btnsWrap'>
							{editingId === plant.id ? (
								<>
									<button
										className='btn btnSubmit'
										onClick={() => saveEditPlant(plant.id)}
									>
										Сохранить
									</button>
									<button className='btn btnDelete' onClick={cancelEdit}>
										Отмена
									</button>
								</>
							) : (
								<>
									<button
										className='btn btnWatering'
										onClick={() =>
											handleWaterPlant(plant.id, plant.wateringLog)
										}
									>
										💧 Полить
									</button>
									<button
										className='btn btnEdit'
										onClick={() => startEditPlant(plant)}
									>
										✏️ Редактировать
									</button>
									<button
										className='btn btnDelete'
										onClick={() => handleDeletePlant(plant.id)}
									>
										🗑️ Удалить
									</button>
								</>
							)}
						</div>
					</div>
				))}
			</div>

			{!loadingPlants && plants.length === 0 && (
				<p className='startMessage'>Добавьте первое растение!</p>
			)}
		</div>
	);
}

export default App;
