import tgIcon from '../i/i_tg.svg';
import emailIcon from '../i/i_email.svg';

function Footer() {
  return (
    <footer>
        <div className='copyright'>
            &copy; Кабанова М. А.,&nbsp;
            <span className='copyrightYear'>
                {
                    new Date().getFullYear()
                }
            </span>
        </div>
        <div className='contacts'>
            <a href='tg://resolve?domain=ginger_mo' alt='telegram'>
                <img src={tgIcon} className='contactsIcon' alt='telegram' />
            </a>
            <a href='mailto:mo.9in9er@gmail.com' alt='mo.9in9er@gmail.com'>
                <img src={emailIcon} className='contactsIcon' alt='email' />
            </a>
        </div>
    </footer>
  );
}

export default Footer;