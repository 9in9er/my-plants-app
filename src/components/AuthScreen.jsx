import '../styles/AuthScreen.scss';

import Header from '../components/Header';

import { useAuth } from '../hooks/useAuth';

function AuthScreen() {
  const {
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    handleLogin,
    handleRegister,
    showResetModal,
    setShowResetModal,
    resetEmail,
    setResetEmail,
    handlePasswordReset,
    resetMessage,
  } = useAuth();

  const isLogin = authMode === 'login';

  return (
    <div className='mainBlock'>
      <Header 
        showCount={false}
      />

      <div className="authScreen">
        {showResetModal && (
          <div className='modalOverlay' onClick={() => setShowResetModal(false)}>
            <div className='modal resetModal' onClick={(e) => e.stopPropagation()}>
              <h2>Сброс пароля</h2>
              <p>Введите email - отправим ссылку для сброса</p>
              <input
                type="email"
                className="inputLogin"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />

              {resetMessage && (
                <div className={`resetMessage ${resetMessage.includes('✅') ? 'success' : 'error'}`}>
                  {resetMessage}
                </div>
              )}

              <div className='modalButtons'>
                <button 
                  type="button" 
                  className="btn btnSubmit"
                  onClick={() => handlePasswordReset(resetEmail)}
                >
                  Отправить ссылку
                </button>
                <button 
                  type="button" 
                  className="btn btnCancel"
                  onClick={() => setShowResetModal(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
        <form className="authForm" onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
          <h1 className="appTitle">
            {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
          </h1>

          <input
            type="email"
            className="inputLogin"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="inputPass"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {authError && <div className="authError">{authError}</div>}

          <button type="submit" className="btn btnSubmit">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>

          {/* Переключатель режимов, использующий существующий .authToggle */}
          <div className="authToggle">
            {isLogin ? (
              <>
                <span>Ещё не зарегистрированы?</span>
                <button
                  type="button"
                  className="btn btnToggle"
                  onClick={() => setAuthMode('register')}
                >
                  Зарегистрироваться
                </button>
              </>
            ) : (
              <>
                <span>Уже есть аккаунт?</span>
                <button
                  type="button"
                  className="btn btnToggle"
                  onClick={() => setAuthMode('login')}
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </form>

        {authMode === 'login' && (
          <div className='forgotPassword'>
            <button 
              className='forgotPasswordLink'
              onClick={() => setShowResetModal(true)}
            >Забыли пароль?</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthScreen;
