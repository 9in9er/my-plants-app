import React from 'react';
import '../styles/Components.scss';
import '../styles/PlantCard.scss';

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
  const log = Array.isArray(plant.wateringLog) ? plant.wateringLog : [];

  return (
    <div className='plantWrap'>
      <div className='plantInfo'>
        {isEditing ? (
          <div className='mainForm'>
            <div className='mainForm_wrap'>
              <div className='nameAndDate'>
                <label className='nameLabel'>
                  Название растения
                  <input
                    className='input inputPlantName'
                    type='text'
                    value={editPlant.name}
                    onChange={(e) =>
                      startEditPlant({ ...plant, name: e.target.value })
                    }
                  />
                </label>
                <label className='dateLabel'>
                  Дата появления
                  <input
                    className='plantDate'
                    type='date'
                    value={editPlant.acquiredAt}
                    onChange={(e) =>
                      startEditPlant({ ...plant, acquiredAt: e.target.value })
                    }
                  />
                </label>
              </div>

              <input
                className='fileLoad'
                type='file'
                accept='image/*'
                onChange={handleEditPhotoChange}
              />

              <div className='btnsWrap btnsWrapEditing'>
                <button
                  className='btn btnSubmit'
                  onClick={() => saveEditPlant(plant.id)}
                >
                  Сохранить
                </button>
                <button className='btn btnDelete' onClick={cancelEdit}>
                  Отмена
                </button>
              </div>

            </div>
          </div>
        ) : (
          <>
            <h3 className='plantName'>{plant.name}</h3>
            <div className='aboutPlant'>
              <div className='photoInfo'>
                {(isEditing ? editPlant?.photo : plant.photo) && (
                  <img
                    className='plantPhoto'
                    src={isEditing ? editPlant?.photo : plant.photo}
                    alt={isEditing ? editPlant?.name || plant.name : plant.name}
                  />
                )}

                <p className='dateOfAppearance'>
                  <strong>Дата появления: </strong>
                  {plant.acquiredAt ? new Date(plant.acquiredAt).toLocaleDateString('ru-RU') : 'неизвестно'}
                </p>
              </div>
              <div className='textInfos'>
                <div className='aboutWatering'>
                  <p>
                    <strong>Последний полив: </strong>
                    {getLastWatering(log)}
                  </p>

                  {log.length > 0 && (
                    <details>
                      <summary>История поливов ({log.length})</summary>
                      <ul className='wateringList'>
                        {log.slice(-8).map((date, index) => (
                          <li key={index}>{formatDate(date)}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <hr />
                </div>

                <div className='notesBlock'>
                  <h4>Заметки</h4>

                  <div className='notesAdd'>
                    <input
                      className='input notesInput'
                      type='text'
                      placeholder='Новая заметка...'
                      value={noteText}
                      onChange={(e) => changeNoteText(plant.id, e.target.value)}
                    />
                    <button
                      className='btn btnSubmit'
                      type='button'
                      onClick={() => {
                        addNoteToPlant(plant.id, notes, noteText);
                        changeNoteText(plant.id, '');
                      }}
                    >
                      Добавить
                    </button>
                  </div>

                  {notes.length === 0 && (
                    <p className='notesEmpty'>Пока нет заметок.</p>
                  )}

                  {notes.length > 0 && (
                    <>
                      <ul className='notesList'>
                        {notes.slice(-3).map((note) => (
                          <li key={note.id} className='notesItem'>
                            <div>
                              <div className='notesText'>{note.text}</div>
                              <div className='notesDate'>
                                {formatDate(note.createdAt)}{' '}
                                {new Date(
                                  note.createdAt
                                ).toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                            <button
                              className='btn btnDelete'
                              type='button'
                              onClick={() =>
                                deleteNoteFromPlant(plant.id, notes, note.id)
                              }
                            >
                              ✖
                            </button>
                          </li>
                        ))}
                      </ul>
                      {notes.length > 3 && (
                        <details className='notesMore'>
                          <summary>
                            Показать все заметки ({notes.length - 3})
                          </summary>

                          <ul className='notesList'>
                            {notes.slice(0, -3).map((note) => (
                              <li key={note.id} className='notesItem'>
                                <div>
                                  <div className='notesText'>{note.text}</div>
                                  <div className='notesDate'>
                                    {formatDate(note.createdAt)}{' '}
                                    {new Date(
                                      note.createdAt
                                    ).toLocaleTimeString('ru-RU', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </div>
                                </div>
                                <button
                                  className='btn btnDelete'
                                  type='button'
                                  onClick={() =>
                                    deleteNoteFromPlant(
                                      plant.id,
                                      notes,
                                      note.id
                                    )
                                  }
                                >
                                  ✖
                                </button>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className='btnsWrap'>
                <button
                  className='btn btnWatering'
                  onClick={() => handleWaterPlant(plant.id, log)}
                >
                  💧
                </button>
                <button
                  className='btn btnEdit'
                  onClick={() => startEditPlant(plant)}
                >
                  ✏️
                </button>
                <button
                  className='btn btnDelete'
                  onClick={() => handleDeletePlant(plant.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PlantCard;
