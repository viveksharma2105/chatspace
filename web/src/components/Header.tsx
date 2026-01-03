interface HeaderProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (value: boolean) => void;
  isConnected: boolean;
  currentRoom: string;
  memberCount: number;
}

export function Header({ isDarkTheme, setIsDarkTheme, isConnected, currentRoom, memberCount }: HeaderProps) {
  return (
    <div className={`backdrop-blur-md border-b px-4 sm:px-6 py-5 shadow-lg transition-colors duration-300 ${
      isDarkTheme
        ? 'bg-black/40 border-gray-800'
        : 'bg-linear-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border-white/20'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 sm:p-3 rounded-xl shadow-lg transition-colors duration-300 ${
            isDarkTheme
              ? 'bg-linear-to-br from-gray-700 to-gray-900'
              : 'bg-linear-to-br from-purple-500 to-pink-500'
          }`}>
            <div className="text-2xl sm:text-3xl">💬</div>
          </div>
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
              ChatSpace
            </h1>
            <p className={`text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors duration-300 ${
              isDarkTheme ? 'text-gray-400' : 'text-purple-200'
            }`}>
              <span className={`w-2 h-2 ${isConnected ? 'bg-green-400' : 'bg-gray-400'} rounded-full animate-pulse`}></span>
              {currentRoom ? `Room: ${currentRoom}` : "Not in a room"}
              {isConnected && memberCount > 0 && (
                <span className="flex items-center gap-1 ml-2">
                  <span>•</span>
                  <span className="font-semibold">{memberCount}</span>
                  <span>👥</span>
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
              isDarkTheme
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={isDarkTheme ? 'Switch to purple theme' : 'Switch to dark theme'}
          >
            <span className="text-2xl">{isDarkTheme ? '🌙' : '☀️'}</span>
          </button>
          <div className={`hidden sm:flex items-center gap-2 text-sm transition-colors duration-300 ${
            isDarkTheme ? 'text-gray-400' : 'text-purple-200'
          }`}>
            <span className={`w-2 h-2 ${isConnected ? 'bg-green-400' : 'bg-gray-400'} rounded-full`}></span>
            <span>{isConnected ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
