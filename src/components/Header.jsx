import titlePic from '../i/title_pic.png';

function Header({
  showCount, 
  count
}) {
  return (
    <header>
        <h1 className='appTitle'><img src={titlePic} className='titlePic' alt='logo' />
          Мои растения{showCount && typeof count === 'number'
          ? ` (${count})`
          : ''
          }
        </h1>
    </header>
  );
}

export default Header;