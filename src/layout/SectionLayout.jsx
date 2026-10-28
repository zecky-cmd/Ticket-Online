export default function SectionLayout({
  children,
  className = '',
  as: Component = 'section',
  fullWidth = true,
  padding = false
}) {
  const baseClasses = fullWidth ? 'w-full' : 'max-w-7xl mx-auto w-full';
  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';
  
  return (
    <Component className={`${baseClasses} ${paddingClasses} ${className}`}>
      {children}
    </Component>
  );
}
