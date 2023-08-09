import Link from 'next/link';
import { User } from '../types';

interface Props {
  user: User | null;
}

const Header = ({ user }: Props) => {
  const links: { label: string; href: string }[] = [];
  if (user) {
    links.push(user && { label: 'Log Out', href: '/auth/logout' });
  } else {
    links.push(
      { label: 'Sign Up', href: '/auth/signup' },
      { label: 'Log In', href: '/auth/login' }
    );
  }

  return (
    <nav className='navbar navbar-light bg-light'>
      <Link className='navbar-brand' href='/'>
        GitTix
      </Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>
          {links.map(({ label, href }) => {
            return (
              <li key={href} className='nav-item'>
                <Link className='nav-link' href={href}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
