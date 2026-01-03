interface JoinRoomProps {
  isDarkTheme: boolean;
  username: string;
  setUsername: (value: string) => void;
  roomId: string;
  setRoomId: (value: string) => void;
  useCustomRoom: boolean;
  setUseCustomRoom: (value: boolean) => void;
  roomCreated: boolean;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onGenerateNewRoom: () => void;
}

export function JoinRoom({
  isDarkTheme,
  username,
  setUsername,
  roomId,
  setRoomId,
  useCustomRoom,
  setUseCustomRoom,
  roomCreated,
  onCreateRoom,
  onJoinRoom,
  onGenerateNewRoom,
}: JoinRoomProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className={`backdrop-blur-lg border rounded-2xl shadow-2xl p-8 w-full max-w-md transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-black/60 border-gray-800'
          : 'bg-white/10 border-white/20'
      }`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Join ChatSpace</h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkTheme ? 'text-gray-400' : 'text-purple-200'
          }`}>Enter your details to get started</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDarkTheme ? 'text-gray-400' : 'text-purple-200'
            }`}>Your Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-sm font-medium transition-colors duration-300 ${
                isDarkTheme ? 'text-gray-400' : 'text-purple-200'
              }`}>Room ID</label>
              <button
                onClick={() => setUseCustomRoom(!useCustomRoom)}
                className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
                  isDarkTheme
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-white/20 hover:bg-white/30 text-purple-200'
                }`}
              >
                {useCustomRoom ? '🔀 Auto ID' : '✏️ Custom'}
              </button>
            </div>
            {useCustomRoom ? (
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter custom room name..."
                className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onJoinRoom();
                  }
                }}
              />
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomId}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 font-mono font-bold text-center focus:outline-none text-sm sm:text-base"
                />
                <button
                  onClick={onGenerateNewRoom}
                  className={`px-4 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isDarkTheme
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  title="Generate new room ID"
                >
                  🔄
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            {!roomCreated && (
              <button
                onClick={onCreateRoom}
                className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Create Room
              </button>
            )}
            <button
              onClick={onJoinRoom}
              className="flex-1 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
