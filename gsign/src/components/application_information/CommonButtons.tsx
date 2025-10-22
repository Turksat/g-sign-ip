import React from 'react';
import ActionButton from './ActionButton';

export interface CommonButtonsProps {
  onAction: (action: string, applicationNumber: string) => void;
  applicationNumber: string;
}

// Ortak buton tanımları
export const CancelButton: React.FC<CommonButtonsProps> = ({ onAction, applicationNumber }) => (
  <ActionButton
    action="cancel"
    label="Cancel"
    variant="danger"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    }
    onClick={() => onAction('cancel', applicationNumber)}
  />
);

export const ApplicationFormButton: React.FC<CommonButtonsProps> = ({ onAction, applicationNumber }) => (
  <ActionButton
    action="view-form"
    label="Application Form"
    variant="primary"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
    onClick={() => onAction('view-application-summary', applicationNumber)}
  />
);

export const MakePaymentButton: React.FC<CommonButtonsProps> = ({ onAction, applicationNumber }) => (
  <ActionButton
    action="make-payment"
    label="Make Payment"
    variant="success"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    }
    onClick={() => onAction('make-payment', applicationNumber)}
  />
);

export const ApplicationSummaryButton: React.FC<CommonButtonsProps> = ({ onAction, applicationNumber }) => (
  <ActionButton
    action="view-summary"
    label="Application Summary"
    variant="warning"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
    onClick={() => onAction('view-summary', applicationNumber)}
  />
);

export const ContinueApplicationButton: React.FC<CommonButtonsProps> = ({ onAction, applicationNumber }) => (
  <ActionButton
    action="continue"
    label="Continue Application"
    variant="primary"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    }
    onClick={() => onAction('continue', applicationNumber)}
  />
);

export const GenerateDocumentButton: React.FC<CommonButtonsProps> = ({ onAction, applicationNumber }) => (
  <ActionButton
    action="generate-document"
    label="Generate Barcoded Document"
    variant="info"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
    onClick={() => onAction('generate-document', applicationNumber)}
  />
);

export const ViewFeedbackButton: React.FC<CommonButtonsProps> = ({ onAction, applicationNumber }) => (
  <ActionButton
    action="view-feedback"
    label="View Feedback"
    variant="warning"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    }
    onClick={() => onAction('view-feedback', applicationNumber)}
  />
);

export const ContinueButton: React.FC<CommonButtonsProps> = ({ onAction, applicationNumber }) => (
  <ActionButton
    action="continue"
    label="Continue"
    variant="primary"
    icon={
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    }
    onClick={() => onAction('continue', applicationNumber)}
  />
);
