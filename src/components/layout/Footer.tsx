function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-6 mt-auto">
        <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                LinkedIn
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                Twitter
            </a>
            </div>
        </div>
        </footer>
    );
}

export default Footer;