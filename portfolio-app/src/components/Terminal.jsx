import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ===== COMMAND DEFINITIONS ===== */
const COMMANDS = {
  help: () => [
    '╔══════════════════════════════════════╗',
    '║      MINDSPACE TERMINAL v1.0.0      ║',
    '╠══════════════════════════════════════╣',
    '║  help      - Show this menu         ║',
    '║  about     - Who is Nirvan?         ║',
    '║  skills    - Technical abilities    ║',
    '║  projects  - View projects          ║',
    '║  contact   - Get in touch           ║',
    '║  goto X    - Navigate to zone X     ║',
    '║  clear     - Clear terminal         ║',
    '║  secret    - ???                    ║',
    '║  matrix    - Enter the matrix       ║',
    '║  hack      - Try to hack me         ║',
    '║  exit      - Close terminal         ║',
    '╚══════════════════════════════════════╝',
  ],
  about: () => [
    '',
    '> LOADING PROFILE...',
    '',
    '  Name     : Nirvan Jain',
    '  Role     : Full-Stack Developer & Creator',
    '  Location : Building the future, one pixel at a time',
    '',
    '  I build things that feel different.',
    '  I care about craft, interaction design,',
    '  and pushing what\'s possible on the web.',
    '',
    '  I don\'t build websites. I build experiences.',
    '',
  ],
  skills: () => [
    '',
    '> SCANNING SKILL MATRIX...',
    '',
    '  ┌─ FRONTEND ────────────────────────┐',
    '  │ React        ████████████████ 95%  │',
    '  │ TypeScript   █████████████░░ 85%   │',
    '  │ Three.js     ████████████░░░ 75%   │',
    '  │ Next.js      █████████████░░ 80%   │',
    '  └───────────────────────────────────┘',
    '  ┌─ BACKEND ─────────────────────────┐',
    '  │ Node.js      █████████████░░ 80%   │',
    '  │ Python       █████████████░░ 85%   │',
    '  │ PostgreSQL   ████████████░░░ 70%   │',
    '  └───────────────────────────────────┘',
    '',
  ],
  projects: () => [
    '',
    '> LOADING PROJECT DATABASE...',
    '',
    '  [01] MINDSPACE',
    '       This portfolio. React + Three.js + Framer Motion',
    '',
    '  [02] PROJECT ALPHA',
    '       Full-stack platform. Next.js + PostgreSQL',
    '',
    '  [03] VOID ENGINE',
    '       Creative coding. WebGL + GLSL + Canvas API',
    '',
    '  [04] NEURAL LINK',
    '       AI integration. Python + TensorFlow + FastAPI',
    '',
    '  Type "goto projects" for the full experience.',
    '',
  ],
  contact: () => [
    '',
    '> ESTABLISHING SECURE CONNECTION...',
    '',
    '  ┌─ REACH ME ────────────────────────┐',
    '  │                                    │',
    '  │  Gmail    : jainnirvan070@gmail.com│',
    '  │  GitHub   : github.com/NirvanJain  │',
    '  │  LinkedIn : /in/nirvan-jain        │',
    '  │  X        : @NirvanJain25          │',
    '  │                                    │',
    '  └────────────────────────────────────┘',
    '',
    '  Let\'s build something extraordinary.',
    '',
  ],
  secret: () => [
    '',
    '  ▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄',
    '',
    '  You found a secret!',
    '',
    '  There are more hidden throughout',
    '  this experience. Keep exploring...',
    '',
    '  Hint: Try clicking on empty spaces.',
    '  Hint: Try "cat .hidden_message"',
    '',
    '  ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀',
    '',
  ],
  matrix: () => {
    const lines = ['', '> INITIATING MATRIX PROTOCOL...', '']
    for (let i = 0; i < 8; i++) {
      let line = '  '
      for (let j = 0; j < 42; j++) {
        line += Math.random() > 0.5 ? '1' : '0'
      }
      lines.push(line)
    }
    lines.push('', '  Welcome to the Matrix, Neo.', '')
    return lines
  },
  hack: () => [
    '',
    '> INITIATING HACK SEQUENCE...',
    '> BYPASSING FIREWALL ████░░░░',
    '> ACCESS DENIED',
    '> ACTIVATING NEURAL OVERRIDE...',
    '> .........',
    '> ACCESS DENIED',
    '> .........',
    '',
    '  Nice try.',
    '  I built this. You can\'t hack me.',
    '',
    '  But I respect the attempt.',
    '',
  ],
  sudo: () => [
    '',
    '  PERMISSION DENIED',
    '',
    '  You are not in the sudoers file.',
    '  This incident will be reported.',
    '',
    '  (Just kidding. Or am I?)',
    '',
  ],
  whoami: () => ['', '  visitor@mindspace', ''],
  pwd: () => ['', '  /home/nirvan/mindspace/terminal', ''],
  ls: () => [
    '',
    '  drwxr-xr-x  projects/',
    '  drwxr-xr-x  skills/',
    '  -rw-r--r--  about.md',
    '  -rw-r--r--  secrets.enc',
    '  -rw-------  .hidden_message',
    '',
  ],
  date: () => ['', `  ${new Date().toString()}`, ''],
  echo: (args) => ['', `  ${args || ''}`, ''],
  cat: (args) => {
    if (args === '.hidden_message') {
      return [
        '',
        '  "The curious ones always find the best things."',
        '  - Nirvan',
        '',
      ]
    }
    if (args === 'about.md') return COMMANDS.about()
    if (args === 'secrets.enc') return ['', '  ERROR: File is encrypted. Nice try.', '']
    return ['', `  cat: ${args || '???'}: No such file or directory`, '']
  },
  rm: () => ['', '  Nice try. Permission denied.', ''],
  neofetch: () => [
    '',
    '        ██████████        visitor@mindspace',
    '      ██          ██      ─────────────────',
    '    ██    ██████    ██    OS: MindspaceOS 1.0',
    '    ██  ██      ██  ██   Host: Browser',
    '    ██  ██      ██  ██   Kernel: React 19',
    '    ██    ██████    ██    Shell: MINDTERM',
    '      ██          ██      Resolution: ' + window.innerWidth + 'x' + window.innerHeight,
    '        ██████████        Theme: Void [Dark]',
    '',
  ],
}

export default function Terminal({ isOpen, onClose, onNavigate }) {
  const [history, setHistory] = useState([
    {
      type: 'output',
      lines: [
        '',
        '  Welcome to MINDSPACE TERMINAL',
        '  Type "help" for available commands.',
        '',
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const processCommand = useCallback(
    (raw) => {
      const trimmed = raw.trim()
      if (!trimmed) return

      const [cmd, ...argParts] = trimmed.toLowerCase().split(' ')
      const args = argParts.join(' ')

      // Record in history
      setHistory((prev) => [...prev, { type: 'input', text: raw }])
      setCmdHistory((prev) => [...prev, raw])
      setHistoryIdx(-1)

      // Special commands
      if (cmd === 'clear') {
        setHistory([])
        return
      }
      if (cmd === 'exit') {
        onClose?.()
        return
      }
      if (cmd === 'goto') {
        const zones = ['void', 'projects', 'skills', 'contact']
        if (zones.includes(args)) {
          setHistory((prev) => [
            ...prev,
            {
              type: 'output',
              lines: ['', `  > Navigating to ${args.toUpperCase()}...`, ''],
            },
          ])
          setTimeout(() => {
            onClose?.()
            onNavigate?.(args)
          }, 600)
          return
        }
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            lines: [
              '',
              `  Unknown zone: "${args}"`,
              '  Available zones: void, projects, skills, contact',
              '',
            ],
          },
        ])
        return
      }

      // Standard commands
      const handler = COMMANDS[cmd]
      if (handler) {
        const output = typeof handler === 'function' ? handler(args) : handler
        setHistory((prev) => [...prev, { type: 'output', lines: output }])
      } else {
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            lines: [
              '',
              `  Command not found: ${cmd}`,
              '  Type "help" for available commands.',
              '',
            ],
          },
        ])
      }
    },
    [onClose, onNavigate]
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length > 0) {
        const idx =
          historyIdx === -1
            ? cmdHistory.length - 1
            : Math.max(0, historyIdx - 1)
        setHistoryIdx(idx)
        setInput(cmdHistory[idx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx !== -1) {
        const idx = historyIdx + 1
        if (idx >= cmdHistory.length) {
          setHistoryIdx(-1)
          setInput('')
        } else {
          setHistoryIdx(idx)
          setInput(cmdHistory[idx])
        }
      }
    } else if (e.key === 'Escape') {
      onClose?.()
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setHistory([])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-8"
          style={{ zIndex: 80 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Terminal window */}
          <motion.div
            className="relative w-full max-w-3xl h-[75vh] bg-black border border-white/15 overflow-hidden flex flex-col"
            initial={{ scale: 0.92, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 15, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border border-white/30" />
                <div className="w-2.5 h-2.5 rounded-full border border-white/30" />
                <div className="w-2.5 h-2.5 rounded-full border border-white/30" />
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] text-white/30 tracking-[0.3em]">
                MINDSPACE://TERMINAL
              </span>
              <button
                onClick={onClose}
                className="text-white/30 hover:text-white text-[10px] sm:text-xs font-mono transition-colors"
                data-hoverable
              >
                [ESC]
              </button>
            </div>

            {/* Scrollable content area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-[11px] sm:text-xs leading-relaxed"
              style={{ scrollbarWidth: 'none' }}
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((entry, i) =>
                entry.type === 'input' ? (
                  <div key={i} className="text-white/80">
                    <span className="text-white/40">visitor@mindspace:~$ </span>
                    {entry.text}
                  </div>
                ) : (
                  <div key={i}>
                    {entry.lines.map((line, j) => (
                      <div key={j} className="text-white/60 whitespace-pre font-mono">
                        {line}
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Input line */}
              <div className="flex items-center mt-0.5">
                <span className="text-white/40 shrink-0 select-none">
                  visitor@mindspace:~${' '}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white/80 font-mono text-[11px] sm:text-xs ml-0.5 caret-white"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </div>
            </div>

            {/* Status bar */}
            <div className="px-4 py-1.5 border-t border-white/8 flex justify-between font-mono text-[8px] sm:text-[9px] text-white/20 shrink-0">
              <span>MINDSPACE TERMINAL v1.0.0</span>
              <span>
                {history.filter((h) => h.type === 'input').length} commands ·
                Ctrl+L clear
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
