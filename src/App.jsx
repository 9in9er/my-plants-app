import React, { useEffect, useState } from 'react';
import './App.css';

// Загрузка списка из localStorage или пустой массив
function App() {
  const [plants, setPlants] = useState(() => {
    const saved = localStorage.getItem('plants');
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);

  // Сохраняем plants в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('plants', JSON.stringify(plants));
  }, [plants]);

  // Обработка выбора файла, конвертация в base64
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

  // обработка добавления растения
  const handleAddPlant = (e) => {
    e.preventDefault(); // блокируем перезагрузку страницы
    if (name.trim() === '') return; // пустые имена игнорируем

    const newPlant = {
      id: Date.now(),
      name,
      photo,
      wateringLog: [], // массив дат поливов
    };

    setPlants([...plants, newPlant]); // добавляем новое растение в массив
    setName(''); // очищаем поле
    setPhoto(null);
    e.target.reset(); // очищаем форму
  };

  // УДАЛЕНИЕ растения
  const handleDeletePlant = (id) => {
    setPlants(plants.filter(plant => plant.id !== id));
  };

  // ДОБАВЛЕНИЕ записи о поливе
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

  // Форматирование даты для отображения
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('ru-Ru');
  }

  // Последний полив
  const getLastWatering = (wateringLog) => {
    if (!wateringLog.length) return 'Ещё не поливали';
    return formatDate(wateringLog[wateringLog.length - 1]);
  };

  return (
    <div className='mainBlock'>
      <h1>🌿 Мои растения</h1>

      <form className='mainForm' onSubmit={handleAddPlant}>
        <div className='mainForm_wrap'>
          <input
            className='plantName'
            type="text"
            placeholder="Название растения"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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