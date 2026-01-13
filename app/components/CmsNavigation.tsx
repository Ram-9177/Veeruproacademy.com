const navigation = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "My Courses", href: "/my-courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" }
]

export default function Navigation() {
  return (
    <nav className="flex gap-6 items-center">
      {navigation.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="text-base font-medium text-gray-700 hover:text-primary transition"
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
