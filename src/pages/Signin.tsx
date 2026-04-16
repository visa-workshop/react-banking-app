import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sentry } from '../sentry';

// components
import Input from '../components/Form/Input';
import Button from '../components/Form/Button';

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  /**
   * Validates an email address format.
   *
   * @param {string} email - The email address to validate.
   * @returns {string} Error message if invalid, empty string if valid.
   */
  const validateEmail = (email: string): string => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  /**
   * Handles email input change and validates the email.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmail(value);
    setEmailError('');
  };

  /**
   * Handles the form submission event by preventing the default behavior and navigating to the home page.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      Sentry.captureMessage(`Email validation error: ${error}`, {
        level: 'warning',
        extra: { email },
      });
      return;
    }

    navigate('/home', { replace: true });
  };

  return (
    <div className='flex flex-v-center flex-h-center h-full'>
      <div className='bg' style={{ height: '100%', borderRadius: 0 }} />
      <div className='text' style={{ width: '100%', maxWidth: '450px' }}>
        <div className='center' style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#FFFFFF', fontWeight: 800, letterSpacing: '3px', fontSize: '2em' }}>VISA</h2>
        </div>
        <h1 style={{ color: '#FFFFFF' }}>Hello! 👋</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)' }}>Please sign in to your account or sign up a new account.</p>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginTop: '20px' }}>
          <form method='post' action='/' className='form' noValidate onSubmit={handleSubmit} style={{ padding: 0 }}>
            <div className='form-line'>
              <div className='label-line'>
                <label htmlFor='email' style={{ color: '#1A1F71' }}>
                  Email
                </label>
              </div>
              <Input
                required
                tabIndex={0}
                name='email'
                type='email'
                value={email}
                autoComplete={false}
                placeholder='Please enter your email'
                error={emailError}
                onChange={handleEmailChange}
              />
            </div>
            <div className='form-line'>
              <div className='label-line flex flex-h-center flex-space-between'>
                <label htmlFor='password' style={{ color: '#1A1F71' }}>
                  Password
                </label>
                <Link to='/'>
                  Forgot password?
                </Link>
              </div>
              <Input
                required
                tabIndex={0}
                name='password'
                type='password'
                autoComplete={false}
                placeholder='Please enter your password'
              />
            </div>
            <div className='form-line'>
              <Button type='submit' text='Sign in' tabIndex={0} />
            </div>
          </form>
        </div>

        <div className='links' style={{ marginTop: '20px' }}>
          <a href='/' style={{ color: 'rgba(255,255,255,0.85)' }}>
            Click here
          </a>
          &nbsp;
          <span style={{ color: 'rgba(255,255,255,0.85)' }}>if you don&apos;t have an account</span>
        </div>
      </div>
    </div>
  );
};

export default Signin;
