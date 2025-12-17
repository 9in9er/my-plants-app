import React from 'react';
import '../styles/Components.scss';
import '../styles/PlantForm.scss';

function PlantForm({
  name,
  acquiredAt,
  onNameChange,
  onDateChange,
  onPhotoChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className='mainForm' onSubmit={onSubmit}>
      <div className='mainForm_wrap'>
        <div className='nameAndDate'>
          <label className='nameLabel'>
            Название растения
            <input
              className='input inputPlantName'
              type='text'
              placeholder='напр. алоказия фрайдек'
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </label>
          <label className='dateLabel'>
            Дата появления
            <input
              className='plantDate'
              type='date'
              value={acquiredAt}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </label>
        </div>
        <input
          className='fileLoad'
          type='file'
          accept='image/*'
          onChange={onPhotoChange}
        />
      </div>

      <div className='modalButtons'>
        <button className='btn btnSubmit' type='submit'>
          Сохранить
        </button>
        <button
          className='btn btnDelete'
          type='button'
          onClick={onCancel}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

export default PlantForm;
