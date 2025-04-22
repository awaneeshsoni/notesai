import { Note } from 'types';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const router = useRouter();

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
        <Button variant="outline" onClick={() => router.push(`/notes/${note.id}`)}>View</Button>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;