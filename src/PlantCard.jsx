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
    addNoteToPlant,
    deleteNoteFromPlant,
    noteText,
    changeNoteText,
}) {
    const isEditing = editingId === plant.id;
    const notes = plant.notes || [];

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



                        <div className="notesBlock">
                            <h4>Заметки</h4>

                            {notes.length === 0 && <p className="notesEmpty">Пока нет заметок.</p>}

                            <ul className="notesList">
                                {notes.map((note) => (
                                    <li key={note.id} className="notesItem">
                                        <div>
                                            <div className="notesText">{note.text}</div>
                                            <div className="notesDate">
                                                {formatDate(note.createdAt)}{' '}
                                                {new Date(note.createdAt).toLocaleTimeString('ru-RU', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                        <button
                                            className="btn btnDelete"
                                            type="button"
                                            onClick={() => deleteNoteFromPlant(plant.id, notes, note.id)}
                                        >
                                            ✖
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="notesAdd">
                                <input
                                    className="input notesInput"
                                    type="text"
                                    placeholder="Новая заметка..."
                                    value={noteText}
                                    onChange={(e) => changeNoteText(plant.id, e.target.value)}
                                />
                                <button
                                    className="btn btnSubmit"
                                    type="button"
                                    onClick={() => {
                                        addNoteToPlant(plant.id, notes, noteText);
                                        changeNoteText(plant.id, '');
                                    }}
                                >
                                    Добавить
                                </button>
                            </div>
                        </div>

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