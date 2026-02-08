import './styles/Base.scss';
import './styles/Components.scss';
import './styles/App.scss';
import AuthScreen from './components/AuthScreen';
import PlantForm from './components/PlantForm';
import PlantCard from './components/PlantCard';
import { useAuth } from './hooks/useAuth';
import { usePlants } from './hooks/usePlants';

import ScrollToTop from './components/ScrollToTop';

import Footer from './components/Footer';
import Header from './components/Header';

import leafPreloader from './i/leaf.svg';

function App() {
  const {
    user,
    authLoading,
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    handleLogin,
    handleRegister,
    handleLogout,
  } = useAuth();

  const {
    plants,
    loadingPlants,
    name,
    setName,
    acquiredAt,
    setAcquiredAt,
    searchQuery,
    setSearchQuery,
    sortMode,
    setSortMode,
    isAddModalOpen,
    setIsAddModalOpen,
    noteTextByPlant,
    editingId,
    editPlant,
    handleAddPlant,
    handleDeletePlant,
    handleWaterPlant,
    deleteWateringEntry,
    handlePhotoChange,
    addNoteToPlant,
    deleteNoteFromPlant,
    changeNoteText,
    startEditPlant,
    handleEditPhotoChange,
    saveEditPlant,
    cancelEdit,
    formatDate,
    getLastWatering,
    getDaysSinceLastWatering,
    sortedPlants,
  } = usePlants(user);

  
  if (authLoading) {
    return (
      <div className='preloader'>
        <div className="preloaderWrap">
          <img src={leafPreloader} className='leaf' alt='загрузка...' />
        </div>
      </div>
    );
  }

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
    <>
      <div className='mainBlock'>
        <Header 
          showCount={true}
          count={plants.length}
        />

        <button className='btn btnLogOut' onClick={handleLogout}>
          Выйти
        </button>

        {isAddModalOpen && (
          <div className='modalOverlay' onClick={() => setIsAddModalOpen(false)}>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
              <h2>Добавить растение</h2>

              <PlantForm
                name={name}
                acquiredAt={acquiredAt}
                onNameChange={setName}
                onDateChange={setAcquiredAt}
                onPhotoChange={handlePhotoChange}
                onSubmit={(e) => {
                  handleAddPlant(e);
                  setIsAddModalOpen(false);
                }}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </div>
          </div>
        )}

        {loadingPlants && (
          <p className='startMessage'>Загружаем ваши растения…</p>
        )}

        <div className='topBar'>
          <button
            className='btn btnSubmit'
            type='button'
            onClick={() => setIsAddModalOpen(true)}
          >
            Добавить растение
          </button>
          
          <div className="searchGroup">
            <input
              className='searchInput'
              type='text'
              placeholder='Поиск по названию'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type='button'
                className='btn clearSearch'
                onClick={() => setSearchQuery('')}
                aria-label='Очистить поиск'
              >
                ×
              </button>
            )}
          </div>

          <div className='sortControls'>
            <label>
              Сортировать по:{' '}
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value='date'>дата добавления (новые → старые)</option>
                <option value='name'>имя (А → Я)</option>
                <option value='watering'>последний полив (давно → недавно)</option>
              </select>
            </label>
          </div>
        </div>

        <div className='plantListWrap'>
          {sortedPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              editingId={editingId}
              editPlant={editPlant}
              startEditPlant={startEditPlant}
              saveEditPlant={saveEditPlant}
              cancelEdit={cancelEdit}
              handleWaterPlant={handleWaterPlant}
              deleteWateringEntry={deleteWateringEntry}
              handleEditPhotoChange={handleEditPhotoChange}
              handleDeletePlant={handleDeletePlant}
              formatDate={formatDate}
              getLastWatering={getLastWatering}
              getDaysSinceLastWatering={getDaysSinceLastWatering}
              addNoteToPlant={addNoteToPlant}
              deleteNoteFromPlant={deleteNoteFromPlant}
              noteText={noteTextByPlant[plant.id] || ''}
              changeNoteText={changeNoteText}
            />
          ))}
        </div>

        {!loadingPlants && plants.length === 0 && (
          <p className='startMessage'>Добавьте первое растение!</p>
        )}
      </div>
      <ScrollToTop />
      <Footer />
    </>
  );
}

export default App;
