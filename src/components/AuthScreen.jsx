import '../styles/Components.scss';
import '../styles/AuthScreen.scss';

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
  const isLogin = authMode === 'login';

  return (
    <div className='mainBlock'>
      <h1>🌿 Мои растения</h1>

      <div className="authScreen">
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
      </div>
    </div>
  );
}

export default AuthScreen;
