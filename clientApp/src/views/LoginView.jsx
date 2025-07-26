import React from 'react';
import { ArrowRight, NotebookPen, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import assets from '../assets/assets';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LoginView = () => {
  const [loginState, setLoginState] = React.useState('Sign Up');
  const [username, setUsername] = React.useState('');
  //const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginIdentifier, setLoginIdentifier] = React.useState('');


  const {login} = useContext(AuthContext)

  const onSubmitHandler = (e) => {
    e.preventDefault();
        if (loginState === "Sign Up") {
          if (isComplete) {
            login('signup', { username, email: loginIdentifier, password, bio });
           
          } else {
            setIsComplete(true);
            return;
          }
        } else {
          login('login',  { identifier: loginIdentifier, password });
        }

  };

  return (
    <div className="bg-cover bg-center min-h-screen flex items-center justify-center px-4 sm:px-8 py-10 backdrop-blur-2xl">
      <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-16 w-full max-w-6xl">
        {/* Logo */}
        <img
          src={assets.logo_big}
          alt="Logo"
          className="w-[min(70vw,300px)] sm:w-[min(40vw,400px)]"
        />

        {/* Form */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-blue-500/5 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-6"
        >
          {/* Header */}
          <h2 className="text-2xl text-white font-bold text-center flex items-center justify-between gap-2">
            {loginState}
            {loginState === 'Sign Up' && isComplete ? (
              <ArrowLeft
                className="w-5 h-5 cursor-pointer hover:text-teal-500/50 active:text-violet-500"
                onClick={() => setIsComplete(false)}
              />
            ) : (
              loginState === 'Sign Up' &&  (
                <ArrowRight
                  className="w-5 h-5 cursor-pointer hover:text-teal-500/50 active:text-violet-500"
                  onClick={() => setIsComplete(true)}
                />
              )
            )}
          </h2>

          {/* Full Name */}
          {loginState === 'Sign Up' && !isComplete && (
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder="Full Name"
              className="w-full p-2 rounded-md bg-teal-500/30 text-white outline-none placeholder:text-blue-300"
              required
            />
          )}

          {/* Email & Password */}
          {!isComplete && (
            <>
              <input
                onChange={(e) => setLoginIdentifier(e.target.value)}
                value=  {loginIdentifier}
                type= {loginState === 'Sign Up' ? 'email' : 'text'}
                placeholder = {loginState === 'Sign Up' ? 'Email' : 'Email or Username'}
                 
                 

                className="w-full p-2 rounded-md bg-teal-500/30 text-white outline-none placeholder:text-blue-300"
                required
              />

              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full p-2 rounded-md bg-teal-500/30 text-white outline-none placeholder:text-blue-300 pr-10"
                  required
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2 text-blue-300 hover:text-blue-200 cursor-pointer active:bg-violet-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </>
          )}

          {/* Bio Section */}
          {loginState === 'Sign Up' && isComplete && (
            <textarea
              rows={4}
              placeholder="Bio (optional)"
              className="w-full p-2 rounded-md bg-teal-500/30 text-white outline-none placeholder:text-blue-300"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>

            
          )}

          {/* Submit Button */}
          <button  type='submit'  className="w-full cursor-pointer bg-blue-500/20 text-white py-2 rounded-md hover:bg-blue-500/30 active:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
            {loginState === 'Sign Up' ? 'Create Account' : 'Login'}
            <NotebookPen className="w-5 h-5 ml-2 inline-block" />
          </button>
         {/* Terms Checkbox */}
  {loginState === 'Sign Up' && (
       
          <div className="flex items-center justify-center text-white text-sm">
            <input type="checkbox" id="completeCheckbox" className="mr-2" required />
            <label htmlFor="completeCheckbox">
              Agree to the terms of use & privacy policy
            </label>
          </div>
  )}

          {/* Auth Toggle */}
          <div className="flex items-center justify-center text-white text-sm text-center">
            {loginState === 'Sign Up' ? (
              <p>
                Already have an account?
                <span
                  onClick={() => {
                    setLoginState('Login');
                    setIsComplete(false);
                  }}
                  className="ml-2 cursor-pointer text-teal-300 hover:text-teal-200 active:text-violet-400"
                >
                  Login right here
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?
                <span
                  onClick={() => setLoginState('Sign Up')}
                  className="ml-2 cursor-pointer text-teal-300 hover:text-teal-200 active:text-violet-400"
                >
                  Sign Up
                </span>
              </p>
            )}
          </div>

          
        </form>
      </div>
    </div>
  );
};

export default LoginView;
