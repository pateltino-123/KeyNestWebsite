import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ReviewsModal from '@/components/ReviewsModal';
import { Review } from '@/mocks/shoes';

const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Great shoes!',
    date: new Date('2024-01-15'),
    verified: true,
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Very comfortable.',
    date: new Date('2024-02-20'),
    verified: false,
  },
];

describe('ReviewsModal', () => {
  it('should render the modal title', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getByText('Reviews')).toBeTruthy();
  });

  it('should render shoe name as subtitle', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getByText('Nike Air Max 90')).toBeTruthy();
  });

  it('should render review count header', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getByText('2 Reviews')).toBeTruthy();
  });

  it('should render singular Review for single review', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={[mockReviews[0]]}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getByText('1 Review')).toBeTruthy();
  });

  it('should render reviewer names', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('Jane Smith')).toBeTruthy();
  });

  it('should render review comments', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getByText('Great shoes!')).toBeTruthy();
    expect(screen.getByText('Very comfortable.')).toBeTruthy();
  });

  it('should show empty state when no reviews', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={[]}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getByText('No reviews yet')).toBeTruthy();
    expect(screen.getByText('Be the first to share your experience!')).toBeTruthy();
  });

  it('should show Write a Review button when onAddReview is provided', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
        onAddReview={jest.fn()}
      />
    );
    expect(screen.getByText('Write a Review')).toBeTruthy();
  });

  it('should not show Write a Review button when onAddReview is not provided', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.queryByText('Write a Review')).toBeNull();
  });

  it('should show add review form when Write a Review is pressed', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
        onAddReview={jest.fn()}
      />
    );

    fireEvent.press(screen.getByText('Write a Review'));
    expect(screen.getByText('Your Review')).toBeTruthy();
    expect(screen.getByText('Rating')).toBeTruthy();
    expect(screen.getByPlaceholderText('Share your experience with these shoes...')).toBeTruthy();
  });

  it('should show cancel and submit buttons in add review form', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
        onAddReview={jest.fn()}
      />
    );

    fireEvent.press(screen.getByText('Write a Review'));
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('should hide form when cancel is pressed', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
        onAddReview={jest.fn()}
      />
    );

    fireEvent.press(screen.getByText('Write a Review'));
    fireEvent.press(screen.getByText('Cancel'));
    expect(screen.queryByText('Your Review')).toBeNull();
  });

  it('should render avatar initials', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={mockReviews}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getAllByText('J').length).toBeGreaterThanOrEqual(1);
  });

  it('should render 0 Reviews header for empty reviews', () => {
    render(
      <ReviewsModal
        visible={true}
        onClose={jest.fn()}
        reviews={[]}
        shoeName="Nike Air Max 90"
      />
    );
    expect(screen.getByText('0 Reviews')).toBeTruthy();
  });
});
