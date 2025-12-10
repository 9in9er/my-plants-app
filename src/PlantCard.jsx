import React from "react";

function PlantCard({
    plant,
    editingId,
    editPlant,
    startEditPlant,
    saveEditPlant,
    cancelEdit,
    handleWaterPlant,
    handleEditPhotoChange,
    handleDeletePlant,
    formatDate,
    getLastWatering,
}) {
    const isEditing = editingId === plant.id;

    return (
    <div className='plantWrap'>
      {(isEditing ? editPlant?.photo : plant.photo) && (
        <img
          className='plantPhoto'
          src={isEditing ? editPlant?.photo : plant.photo}
          alt={isEditing ? editPlant?.name || plant.name : plant.name}
        />
      )}

      <div className='plantInfo'>
        {isEditing ? (
          <>
            <input
              className='input plantName'
              type='text'
              value={editPlant.name}
              onChange={(e) =>
                startEditPlant({ ...plant, name: e.target.value })
              }
            />
            <input
              className='plantDate'
              type='date'
              value={editPlant.acquiredAt}
              onChange={(e) =>
                startEditPlant({ ...plant, acquiredAt: e.target.value })
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
        {isEditing ? (
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
              onClick={() => handleWaterPlant(plant.id, plant.wateringLog)}
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
  );
}

export default PlantCard;