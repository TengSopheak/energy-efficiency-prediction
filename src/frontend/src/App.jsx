import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Nav from './components/Nav';
import About from './components/About';
import Demo from './components/Demo';
import Prediction from './components/Prediction';
import Model from './components/Model';
import Stack from './components/Stack';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            import('./components/ui/ui-behaviors.js');
            import('./components/ui/ThreeScene.js');
        });

        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div className="App">
            <Nav />
            <Hero />
            <div className="section-divider"></div>

            <About />
            <div className="section-divider"></div>

            <Demo />
            <div className="section-divider"></div>

            <Prediction />
            <div className="section-divider"></div>

            <Model />
            <div className="section-divider"></div>

            <Stack />
            <div className="section-divider"></div>

            <Contact />
            <div className="section-divider"></div>
            
            <Footer />
        </div>
    );
}

export default App
