"use client";


import { useState } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';


const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] =
    useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setvalues] = useState({
      dateTime: new Date(),
      description: '',
      link: ''
    })
    const [callDetails, setcallDetails] = useState<Call>()
    const { toast } = useToast()

    const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if(!values.dateTime) {
        toast({
          title: "Please Select a Date and Time for Meeting"
        })
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call)
        throw new Error("Failed to create call Daniel is working on it!");

      const startsAt =
        values.dateTime.toISOString() || new Date().toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setcallDetails(call)

      if(!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({
        title: "Meeting Created Successfully"
      })
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting Daniel is working on it"
      })
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
                    img="/icons/add-meeting.svg"
                    title="New Meeting"
                    description="Start an instant meeting"
                    handleClick={() => setMeetingState('isInstantMeeting')}
        />
        <HomeCard 
                    img="/icons/schedule.svg"
                    title="schedule Meeting"
                    description="Plan Meeting"
                    handleClick={() => setMeetingState('isScheduleMeeting')}
        />
        <HomeCard
                    img="/icons/recordings.svg"
                    title="View Recordings"
                    description="Check out your recordings"
                    handleClick={() => router.push('/recordings')}
         />
        <HomeCard
                    img="/icons/join-meeting.svg"
                    title="Join Meeting"
                    description="Via invitation link"
                    handleClick={() => setMeetingState('isJoiningMeeting')}
         />
         {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          tittle="Create Meeting"
          handleClick={createMeeting}
          buttonText=''
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-white">
              Add a description
            </label>
            <textarea
              className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setvalues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-white">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setvalues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-2 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          tittle="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link Copied' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        tittle="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setvalues({ ...values, link: e.target.value })}
          className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

         <MeetingModal 
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={() => setMeetingState(undefined)}
          tittle="Start an instant meeting"
          className="text-center"
          buttonText="Start Now"
          handleClick={createMeeting}
         />
    </section>
  )
}

export default MeetingTypeList