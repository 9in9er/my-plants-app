import React, { useEffect, useState } from 'react';

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
        setPhoto(reader.result); // сохраняем base64
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
    if (!wateringLog) return 'Ещё не поливали';
    return formatDate(wateringLog[wateringLog.length - 1]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🌿 Мои растения</h1>

      <form onSubmit={handleAddPlant} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Название растения"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '10px' }}
            required
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handlePhotoChange} 
            style={{ padding: '10px' }}
          />
          <button 
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Добавить
          </button>
        </div>
      </form>

      <div style={{ display: 'grid', gap: '20px' }}>
        {plants.map((plant) => (
          <div 
            key={plant.id} 
            style={{ 
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              gap: '15px',
              alignItems: 'flex-start'
            }}
          >
            {plant.photo && (
                <img
                  src={plant.photo}
                  alt={plant.name}
                  style={{ 
                    width: '80px', 
                    height:'80px', 
                    objectFit: 'cover',
                    borderRadius: '5px',
                    flexShrink: 0
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{plant.name}</h3>
                <p><strong>Последний полив:</strong>{getLastWatering(plant.wateringLog)}</p>

                {plant.wateringLog.length > 0 && (
                  <details>
                    <summary>История поливов ({plant.wateringLog.length})</summary>
                    <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
                      {plant.wateringLog.slice(-5).map((date, index) => (
                        <li key={index}>{formatDate(date)}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => handleWaterPlant(plant.id)}
                  style={{ 
                    padding: '8px 16px',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  💧 Полить
                </button>
                <button
                  onClick={() => handleDeletePlant(plant.id)}
                  style={{
                    padding: '8px 16px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Удалить
                </button>
              </div>
          </div>
        ))}
      </div>

      {plants.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic'}}>
          Добавьте первое растение!
        </p>
      )}
    </div>
  );
}

export default App;