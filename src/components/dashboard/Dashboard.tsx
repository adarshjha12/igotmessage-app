  <button
    onClick={() => handleNavClick('/dash/create')}
    type="button"
    className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)] `}>
    <div className={`flex flex-col rounded-xl ${pathname === '/dash/create'? 'bg-blue-900' : ''} px-4 items-center justify-center gap-1`}>
      <PlusSquareIcon
        weight={pathname === '/dash/create' ? 'fill' : 'regular'}
        size={25}
        strokeWidth={1.5}
      />
    </div>
    <p className="text-sm">Create</p>
  </button>

  <button
    onClick={() => handleNavClick('/dash/chats')}
    type="button"
    className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)] `}>
    <div className={`flex flex-col rounded-xl ${pathname === '/dash/chats'? 'bg-blue-900' : ''} px-4 items-center justify-center gap-1`}>
      <ChatCircleDotsIcon
        size={25}
        strokeWidth={1.5}
        weight={pathname === '/dash/chats' ? 'fill' : 'regular'}
      />
    </div>
    <p className="text-sm">Messages</p>
  </button>

  <button 
    onClick={() => handleNavClick('/reels')}
    type="button"
    className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)] `}>
    <div className={`flex flex-col rounded-xl ${pathname === '/reels'? 'bg-blue-900' : ''} px-4 items-center justify-center gap-1`}>
      <PlayIcon
        size={25}
        strokeWidth={1.5}
        weight={pathname === '/reels' ? 'fill' : 'regular'}
      />
    </div>
    <p className="text-sm">Reels</p>
  </button>

  <button 
    onClick={() => handleNavClick('/dash/calls')}
    type="button"
    className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)] `}>
    <div className={`flex flex-col rounded-xl ${pathname === '/dash/calls'? 'bg-blue-900' : ''} px-4 items-center justify-center gap-1`}>
      <VideoCameraIcon
        size={25}
        strokeWidth={1.5}
        weight={pathname === '/dash/calls' ? 'fill' : 'regular'}
      />
    </div>
    <p className="text-sm">Calls</p>
  </button>

  <button
    onClick={() => handleNavClick('/dash/profile')}
    type="button" 
    className={`flex flex-col items-center justify-center relative gap-1 cursor-pointer active:bg-[var(--wrapperColor)] `}>
    <div className={`flex flex-col rounded-xl ${pathname === '/dash/profile'? 'bg-blue-900' : ''} px-4 items-center justify-center gap-1`}>
      {avatar ? 
        <img src={avatar} alt="avatar" className="w-8 h-8 rounded-xl" /> 
        : 
        <UserCircleIcon
          size={25} 
          strokeWidth={1.5} 
          weight={pathname === '/dash/profile' ? 'fill' : 'regular'} 
        />
      }
    </div>
    <p className="text-sm">Profile</p>
  </button> 