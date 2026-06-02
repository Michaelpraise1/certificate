import { Outlet } from 'react-router-dom';
import Logo from '../components/logo';


export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Visual / Brand Side */}
      <div className="hidden sm:flex sm:w-1/2 lg:w-5/12 bg-secondary text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 max-w-md text-center flex flex-col items-center">
          <div className="w-48 h-24 bg-primary flex items-center justify-center rounded-2xl mb-8 shadow-xl">
             <span className="text-white font-extrabold text-2xl">
                <Logo />
             </span>
          </div>
          <h1 className="text-4xl text-primary font-bold mb-4 tracking-tight">Talentia Hub</h1>
          <p className="text-lg text-primary">
            The standard for verifiable professional credentials. Join thousands of certified professionals today.
          </p>
        </div>
      </div>
      
      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
