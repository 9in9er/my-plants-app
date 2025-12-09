import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [plants, setPlants] = useState(() => {
		const saved = localStorage.getItem('plants');
		return saved ? JSON.parse(saved) : [];
	});

	const [name, setName] = useState('');
	const [photo, setPhoto] = useState(null);
	const [acquiredAt, setAcquiredAt] = useState('');
	const [editingId, setEditingId] = useState(null);
	const [editPlant, setEditPlant] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		localStorage.setItem('plants', JSON.stringify(plants));
	}, [plants]);


	const readFileAsDataUrl = (file, callback) => {
		const reader = new FileReader();
		reader.onloadend = () => callback(reader.result);
		reader.readAsDataURL(file);
	}

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) readFileAsDataUrl(file, setPhoto);
	};

	const handleAddPlant = (e) => {
		e.preventDefault();
		if (name.trim() === '') return;

		const newPlant = {
			id: Date.now(),
			name,
			photo,
			acquiredAt,
			wateringLog: [],
		};

		setPlants([...plants, newPlant]);
		setName('');
		setPhoto(null);
		e.target.reset();
		setAcquiredAt('');
	};


	const handleDeletePlant = (id) => {
		setPlants(plants.filter(plant => plant.id !== id));
	};


	const handleWaterPlant = (id) => {
		const updatedPlants = plants.map(plant => {
			if (plant.id === id) {
				return {
					...plant,
					wateringLog: [...plant.wateringLog, new Date().toISOString()]
				};
			}
			return plant;
		});
		setPlants(updatedPlants);
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
		if (file) readFileAsDataUrl(file, (dataUrl) =>
			setEditPlant({ ...editPlant, photo: dataUrl })
		);
	};

	const saveEditPlant = (id) => {
		setPlants(plants.map(plant =>
			plant.id === id
				? { ...plant, ...editPlant }
				: plant
		));
		setEditingId(null);
		setEditPlant(null);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditPlant(null);
	};


	const formatDate = (isoString) => {
		return new Date(isoString).toLocaleDateString('ru-RU');
	}


	const getLastWatering = (wateringLog) => {
		if (!wateringLog.length) return 'Ещё не поливали';
		return formatDate(wateringLog[wateringLog.length - 1]);
	};

	const filteredPlants = plants.filter((plant) =>
		plant.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='mainBlock'>
			<h1>🌿 Мои растения</h1>

			<input 
				className='searchInput'
				type="text" 
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
								type="text"
								placeholder="напр. алоказия фрайдек"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</label>
						<label className='dateLabel'>
							Дата появления
							<input
								className='plantDate'
								type="date"
								value={acquiredAt}
								onChange={(e) => setAcquiredAt(e.target.value)}
							/>
						</label>
					</div>
					<input
						className='fileLoad'
						type="file"
						accept="image/*"
						onChange={handlePhotoChange}
					/>
					<button className='btn btnSubmit' type="submit">
						Добавить
					</button>
				</div>
			</form>

			<div className='plantListWrap'>
				{filteredPlants.map((plant) => (
					<div className='plantWrap' key={plant.id}>
						{(editingId === plant.id ? editPlant?.photo : plant.photo) && (
							<img
								className='plantPhoto'
								src={editingId === plant.id ? editPlant?.photo : plant.photo}
								alt={editingId === plant.id ? editPlant?.name || plant.name : plant.name}
							/>
						)}

						<div className='plantInfo'>
							{editingId === plant.id ? (
								<>
									<input
										className='input plantName'
										type="text"
										value={editPlant.name}
										onChange={(e) => setEditPlant({ ...editPlant, name: e.target.value })}
									/>
									<input
										className='plantDate'
										type="date"
										value={editPlant.acquiredAt}
										onChange={(e) => setEditPlant({ ...editPlant, acquiredAt: e.target.value })}
									/>
									<input
										className='fileLoad'
										type="file"
										accept="image/*"
										onChange={handleEditPhotoChange}
									/>
								</>
							) : (
								<>
									<h3 className='plantName'>{plant.name}</h3>
									<p><strong>Последний полив: </strong>{getLastWatering(plant.wateringLog)}</p>
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
									<button
										className='btn btnDelete'
										onClick={cancelEdit}
									>
										Отмена
									</button>
								</>
							) : (
								<>
									<button
										className='btn btnWatering'
										onClick={() => handleWaterPlant(plant.id)}
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

			{plants.length === 0 && (
				<p className='startMessage'>
					Добавьте первое растение!
				</p>
			)}
		</div>
	);
}

export default App;