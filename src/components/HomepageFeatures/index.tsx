import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'React17 技术栈',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        基于 React 17.x 版本，充分利用新特性如 useTransition、并发渲染和自动批处理，
        结合 TypeScript 提供类型安全的开发体验。
      </>
    ),
  },
  {
    title: 'AntD/AntDX 组件库',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        使用 Ant Design 5.x 和 Ant Design X 组件库，提供丰富的 UI 组件和 AI 对话场景支持，
        快速构建高质量的企业级应用界面。
      </>
    ),
  },
  {
    title: '规范化开发',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        严格遵循阿里前端编码规约，包括命名规范、代码格式、注释要求等，
        确保代码的高可维护性和团队协作效率。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
