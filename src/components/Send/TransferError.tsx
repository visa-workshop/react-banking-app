import Button from '../Form/Button';

// interfaces
interface IProps {
  errorMessage: string;
  onRetry: () => void;
  onCancel: () => void;
}

const TransferError: React.FC<IProps> = ({ errorMessage, onRetry, onCancel }) => (
  <div className='flex flex-col flex-v-center flex-h-center' style={{ padding: '40px 0' }}>
    <span
      className='material-symbols-outlined'
      style={{ fontSize: '4em', color: '#D32F2F', marginBottom: '20px' }}
    >
      error
    </span>
    <h1 className='title no-select'>Transfer Failed</h1>
    <p
      className='information text-shadow center'
      style={{ marginBottom: '30px', maxWidth: '400px' }}
    >
      {errorMessage}
    </p>
    <div className='add-buttons flex flex-space-between'>
      <Button type='button' text='Try Again' tabIndex={0} onClick={onRetry} />
    </div>
    <div className='center' style={{ marginTop: '15px' }}>
      <button
        type='button'
        className='text-shadow'
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          font: 'inherit',
          color: 'inherit',
        }}
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  </div>
);

export default TransferError;
