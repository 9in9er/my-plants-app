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

	useEffect(() => {
		localStorage.setItem('plants', JSON.stringify(plants));
	}, [plants]);

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhoto(reader.result);
			};
			reader.readAsDataURL(file);
		}
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


	const formatDate = (isoString) => {
		return new Date(isoString).toLocaleDateString('ru-Ru');
	}


	const getLastWatering = (wateringLog) => {
		if (!wateringLog.length) return 'Ещё не поливали';
		return formatDate(wateringLog[wateringLog.length - 1]);
	};

	return (
		<div className='mainBlock'>
			<h1>🌿 Мои растения</h1>

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
					<button
						className='btn btnSubmit'
						type="submit"
					>
						Добавить
					</button>
				</div>
			</form>

			<div className='plantListWrap'>
				{plants.map((plant) => (
					<div
						className='plantWrap'
						key={plant.id}
					>
						{plant.photo && (
							<img
								className='plantPhoto'
								src={plant.photo}
								alt={plant.name}
							/>
						)}

						<div className='plantInfo'>
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
						</div>

						<div className='btnsWrap'>
							<button
								className='btn btnWatering'
								onClick={() => handleWaterPlant(plant.id)}
							>
								💧 Полить
							</button>
							<button
								className='btn btnDelete'
								onClick={() => handleDeletePlant(plant.id)}
							>
								🗑️ Удалить
							</button>
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