import React from 'react';
import ExerciseLayout from './ExerciseLayout.jsx';

export function ProductCard({ name, price, rating, inStock }) {
  return (
    <article className="catalog-card product-card">
      <p className="eyebrow">SAMPLE PRODUCT</p>
      <h2>{name}</h2>
      <p className="price">{price.toLocaleString('ko-KR')}원</p>
      <p className="rating">{rating} / 5 stars</p>
      <span className={`badge ${inStock ? 'available' : 'unavailable'}`}>{inStock ? 'In Stock' : 'Out of Stock'}</span>
    </article>
  );
}

export default function ProductPage() {
  return (
    <ExerciseLayout title="PRODUCT CARDS" description="One component, different props. Sample products demonstrate KRW prices, ratings, and both stock states.">
      <section className="catalog-grid" aria-label="Sample products">
        <ProductCard name="Wireless Earbuds" price={89000} rating={4.5} inStock={true} />
        <ProductCard name="Compact Keyboard" price={69000} rating={4.2} inStock={false} />
        <ProductCard name="USB-C Hub" price={35000} rating={4} inStock={true} />
        <ProductCard name="Wireless Mouse" price={29000} rating={4.6} inStock={true} />
        <ProductCard name="Laptop Stand" price={39000} rating={4.4} inStock={true} />
        <ProductCard name="Portable SSD 1TB" price={119000} rating={4.8} inStock={false} />
        <ProductCard name="27-inch Monitor" price={249000} rating={4.7} inStock={true} />
        <ProductCard name="Noise-Cancelling Headphones" price={159000} rating={4.6} inStock={true} />
        <ProductCard name="1080p Webcam" price={49000} rating={4.3} inStock={false} />
      </section>
      <p className="data-note">Practice data only. Change a prop in ProductCard.jsx to see how the same component renders different values.</p>
    </ExerciseLayout>
  );
}
