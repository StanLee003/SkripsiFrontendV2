const AdminToggle = ({ isAdmin, onChange, disabled }) => {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!isAdmin);
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={disabled}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${isAdmin ? 'bg-green-500' : 'bg-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span
                aria-hidden="true"
                className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg ring-0 transition ease-in-out duration-200 ${isAdmin ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );
};

export default AdminToggle;
