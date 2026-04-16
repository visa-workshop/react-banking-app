import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sentry } from '../sentry';
import { useAuth } from '../context/AuthContext';

// components
import Input from '../components/Form/Input';
import Button from '../components/Form/Button';

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setLoginError('');
  };

  /**
   * Handles password input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    setLoginError('');
  };

  /**
   * Handles the form submission event by preventing the default behavior and navigating to the home page.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
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

    setIsLoading(true);
    setLoginError('');

    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-v-center flex-h-center h-full'>
      <div className='bg' />
      <div className='text'>
        <h1 className='text-shadow'>Hello! 👋</h1>
        <p className='text-shadow'>Please sign in to your account or sign up a new account.</p>

        <form method='post' action='/' className='form' noValidate onSubmit={handleSubmit}>
          <div className='form-line'>
            <div className='label-line'>
              <label htmlFor='email' className='text-shadow'>
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
              <label htmlFor='password' className='text-shadow'>
                Password
              </label>
              <Link to='/' className='text-shadow'>
                Forgot password?
              </Link>
            </div>
            <Input
              required
              tabIndex={0}
              name='password'
              type='password'
              value={password}
              autoComplete={false}
              placeholder='Please enter your password'
              onChange={handlePasswordChange}
            />
          </div>
          {loginError && (
            <div className='form-line'>
              <p style={{ color: '#ff6b6b', fontSize: '0.9em', margin: 0 }}>{loginError}</p>
            </div>
          )}
          <div className='form-line'>
            <Button type='submit' text={isLoading ? 'Signing in...' : 'Sign in'} tabIndex={0} />
          </div>
        </form>

        <div className='links'>
          <a href='/' className='text-shadow'>
            Click here
          </a>
          &nbsp;
          <span className='text-shadow'>if you don&apos;t have an account</span>
        </div>
      </div>
    </div>
  );
};

export default Signin;
