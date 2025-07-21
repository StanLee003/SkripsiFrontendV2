const UserAvatar = ({ user, size = 'large' }) => {
    const sizeClasses = size === 'large' ? 'w-12 h-12' : 'w-10 h-10';
    const initial = user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase();

    if (user.photoURL) {
        return <img src={user.photoURL} alt={user.displayName} className={`${sizeClasses} rounded-full object-cover bg-gray-700`} />;
    }

    return (
        <div className={`${sizeClasses} bg-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold`}>
            {initial}
        </div>
    );
};

export default UserAvatar;