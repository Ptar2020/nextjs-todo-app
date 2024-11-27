'use client'
import Link from 'next/link';

const resetPassword = () => {

    const reset = () => {
        alert("Reseting");
    };

    return(
    <div className='' >
        <h3 className=''>RESET YOUR PASSWORD</h3>
        <label className='flex flex-col mb-2'>Enter your registered email address</label>
        <input className='mb-2' type='email' placeholder='Email address' /><br/>
        <button onClick={reset} className='link  '>Reset</button><br/>
        <Link className='link' href='/login'>Back to login</Link>
    </div>)
};
export default resetPassword;