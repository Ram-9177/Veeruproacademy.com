import { motion, HTMLMotionProps } from 'framer-motion'
import React from 'react'

type FadeInProps = HTMLMotionProps<'div'>

export const FadeIn: React.FC<FadeInProps> = ({ children, ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    {...rest}
  >
    {children}
  </motion.div>
)

FadeIn.displayName = 'FadeIn'

export default FadeIn
