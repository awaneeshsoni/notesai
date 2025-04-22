'use client';

import { Note } from 'types';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { RotateCw } from "lucide-react";
import { useState } from 'react';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewClick = () => {
    try{
        setIsLoading(true);
        router.push(`/notes/${note.id}`)
    }
    finally{() => setIsLoading(false)};
  };


  return (
    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>Updated: {new Date(note.updated_at).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{note.content.substring(0, 100)}...</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={handleViewClick} disabled={isLoading}>
          {isLoading ? (
            <>
              Viewing... <RotateCw className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "View"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;