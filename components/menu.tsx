import Link from 'next/link';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { config } from '../config';
import { useOnClickOutside } from '../hooks';
import styles from './styles/menu.module.scss';

const Menu = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => setMenuOpen(() => !menuOpen);

	const buttonRef = useRef<HTMLButtonElement>(null);
	const navRef = useRef<HTMLElement>(null);

	let menuFocusables: any;
	let firstFocusableEl: any;
	let lastFocusableEl: any;

	const setFocusables = () => {
		menuFocusables = [
			buttonRef.current,
			//@ts-ignore
			...Array.from(navRef.current.querySelectorAll('a')),
		];
		firstFocusableEl = menuFocusables[0];
		lastFocusableEl = menuFocusables[menuFocusables.length - 1];
	};

	const handleBackwardTab = (e: KeyboardEvent) => {
		if (document.activeElement === firstFocusableEl) {
			e.preventDefault();
			lastFocusableEl.focus();
		}
	};

	const handleForwardTab = (e: KeyboardEvent) => {
		if (document.activeElement === lastFocusableEl) {
			e.preventDefault();
			firstFocusableEl.focus();
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'Escape':
			case 'Spacebar': {
				setMenuOpen(false);
				break;
			}

			case 'Tab': {
				if (menuFocusables && menuFocusables.length === 1) {
					e.preventDefault();
					break;
				}
				if (e.shiftKey) {
					handleBackwardTab(e);
				} else {
					handleForwardTab(e);
				}
				break;
			}

			default: {
				break;
			}
		}
	};

	const onResize = (e: UIEvent) => {
		if (window.innerWidth > 768) {
			setMenuOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown);
		window.addEventListener('resize', onResize);

		setFocusables();

		return () => {
			document.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('resize', onResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const wrapperRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(wrapperRef, () => setMenuOpen(false));

	return (
		<>
			<div className="hidden md:block">
				<div ref={wrapperRef}>
					<button
						ref={buttonRef}
						className="hidden 
					md:relative md:flex md:justify-center md:items-center md:z-10 md:mr-[-15px] md:p-[15px] md:border-0 md:bg-[transparent] md:normal-case md:transition-opacity md:ease-linear md:duration-150 
				"
						onClick={toggleMenu}
					>
						<div className={`ham-box inline-block relative w-[30px] h-6`}>
							<div
								className={`${styles['ham-box-inner']} ${
									menuOpen ? styles['ham-box-inner-menu-open'] : ''
								} absolute top-[50%] right-0 w-[30px] h-0.5 rounded-[4px] bg-purple duration-[0.22s] transition-transform
							
							before:block before:absolute before:left-auto before:right-0 before:w-[30px] before:h-0.5 before:rounded-[4px] before:bg-purple before:transition-transform before:ease-in before:duration-[0.15s]
							after:block after:absolute after:left-auto after:right-0 after:w-[30px] after:h-0.5 after:rounded-[4px] after:bg-purple after:transition-transform after:ease-in after:duration-[0.15s]`}
							></div>
						</div>
					</button>

					<div
						className={`${styles['styled-sidebar']} ${
							menuOpen ? styles['sidebar-menu-open'] : ''
						} bg-grey`}
						aria-hidden={!menuOpen}
						tabIndex={menuOpen ? 1 : -1}
					>
						<nav ref={navRef}>
							{config.navLinks && (
								<ol>
									{config.navLinks.map(({ name, url }, index) => (
										<li key={index}>
											<Link href={url}>
												<a
													onClick={() => setMenuOpen(false)}
													className="text-darkblue w-[42px] h-[42px] p-[10px]"
												>
													{name}
												</a>
											</Link>
										</li>
									))}
								</ol>
							)}

							<Link
								className="resume-link"
								href="/resume.pdf"
								target="_blank"
								rel="noopener noreferrer"
							>
								<a className="text-purple bg-[transparent] border-[1px] border-solid border-purple rounded-[4px] py-[0.75rem] px-[1rem] text-sm font-mono leading-[1] cursor-pointer transition hover:bg-purple/10 focus:bg-purple/10 active:bg-purple/10 hover:outline-none focus:outline-none active:outline-none after:hidden">
									Resume
								</a>
							</Link>
						</nav>
					</div>
				</div>
			</div>
		</>
	);
};

export default Menu;
