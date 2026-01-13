// Removed wrapper to prefer canonical app/components/Navbar usage
// If your code still imports this file, update it to:
// import { Navbar } from '@/app/components/Navbar'

export default function DeprecatedNavbarWrapper(): never {
	throw new Error("Deprecated wrapper 'components/layout/navbar' removed. Import '@/app/components/Navbar' directly.")
}
