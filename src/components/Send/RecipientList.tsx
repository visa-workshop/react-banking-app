import { useAppContext } from '../../context/AppContext';

// Re-export Recipient type from context
export type { Recipient } from '../../context/AppContext';

// interfaces
interface IProps {
  onSelect: (recipient: {
    id: number;
    name: string;
    initials: string;
    color: string;
    accountInfo: string;
  }) => void;
  selectedId?: number;
}

const RecipientList: React.FC<IProps> = ({ onSelect, selectedId = undefined }) => {
  const { recipients } = useAppContext();

  return (
    <div className='history'>
      {recipients.map((recipient) => (
        <div
          key={recipient.id}
          role='button'
          tabIndex={0}
          className='history-line flex flex-v-center'
          style={selectedId === recipient.id ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}}
          onClick={() => onSelect(recipient)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelect(recipient);
            }
          }}
        >
          <div
            className={`flex flex-v-center flex-h-center no-select circle-icon ${recipient.color}`}
          >
            <span style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9em' }}>
              {recipient.initials}
            </span>
          </div>
          <div className='history-line-details'>
            <p className='name'>{recipient.name}</p>
            <p className='time'>{recipient.accountInfo}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipientList;
