// max-width: 80rem (1280px)
const Container = ({ children, className }) => {
    return (
        <div className={`mx-auto max-w-7xl sm:px-4 ${className && className}`}>
            {children}
        </div>
    );
};

export default Container;
