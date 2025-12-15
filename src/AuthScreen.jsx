import React from 'react';
import './styles/Components.scss';
import './styles/AuthScreen.scss';

function AuthScreen({
  authMode,
  setAuthMode,
  email,
  password,
  setEmail,
  setPassword,
  authError,
  handleLogin,
  handleRegister,
}) {
  const onSubmit = authMode === 'login' ? handleLogin : handleRegister;

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

      <form className='authForm' onSubmit={onSubmit}>
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

export default AuthScreen;
