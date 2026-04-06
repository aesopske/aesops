import { useState } from 'react'
import Hamburger from 'hamburger-react'

function Navbar() {
    const [isOpen, setOpen] = useState(false)
    return (
        <div className='navbar'>
            <div className='navbar__menu'>
                <ul>
                    <li>Home</li>
                    <li>Services</li>
                    <li>Projects</li>
                    <li>About</li>
                    <li>Contact</li>
                </ul>
            </div>
            <div className='navbar__hamburger'>
                <Hamburger toggled={isOpen} toggle={setOpen} />
            </div>
        </div>
    )
}

export default Navbar