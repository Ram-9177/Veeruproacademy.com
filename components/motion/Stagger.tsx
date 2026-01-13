import { motion, MotionProps } from 'framer-motion'
import React from 'react'
import styled from '@emotion/styled';

const BackgroundDiv = styled.div`
  background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
  filter: blur(8px);
`;

interface StaggerProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
}
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }
export const Stagger: React.FC<StaggerProps> = ({ children, className, ...rest }) => {
  return (
    <BackgroundDiv className={className}>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        {...rest}
      >
        {React.Children.map(children, (child, i) => (
          <motion.div variants={item} key={i}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    </BackgroundDiv>
  );
};
export default Stagger
