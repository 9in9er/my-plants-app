import titlePic from '../i/title_pic.png';

function Header() {
  return (
    <header>
        <h1 className='appTitle'><img src={titlePic} className='titlePic' alt='logo' /> Мои растения</h1>
    </header>
  );
}

export default Header;