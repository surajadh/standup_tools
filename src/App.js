import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import { Typography, Textarea, Button, Divider, List, ListItem, ListItemContent, ListItemButton, Avatar } from '@mui/joy';
import { KeyboardArrowDown } from '@mui/icons-material';
function App() {
  // Get members from local storage
  // If members are not in local storage, set members to empty array
  // If members are in local storage, set members to local storage value
  let membersFromStorage = localStorage.getItem('members') ? JSON.parse(localStorage.getItem('members')) : [];
  
  // if membersfromstorage is not of type array clear local storage
  if (!Array.isArray(membersFromStorage)) {
    localStorage.clear();
    membersFromStorage = [];
  }
  const [memberString, setMemberString] = React.useState('');
  const [members, setMembers] = React.useState(membersFromStorage);
  const showGrid = members.length > 0;

  
  const handleInputChange = (event) => {
    const memberString = event.target.value;
    setMemberString(memberString);
  };

  const randomize = () => {
    const membersCopy = [...members];
    membersCopy.sort(() => Math.random() - 0.5);
    setMembers(membersCopy);
  }

  const handleAddMember = () => {
    const newMembers = memberString.split(',');
    const trimmedNewMembers = newMembers.map((member) => member.trim()).filter((member) => member.length > 0);
    const existingMembers = [...members];
    // ignorecase check for duplicates and add to existing members
    trimmedNewMembers.forEach((newMember) => {
      const existingMember = existingMembers.find((member) => member.toLowerCase() === newMember.toLowerCase());
      if (!existingMember) {
        existingMembers.push(newMember);
      }
    });
    setMembers(existingMembers);
    setMemberString('');
    // Clear textarea

    localStorage.setItem('members', JSON.stringify(existingMembers));
  }

  const clearCache = () => {
    localStorage.clear();
    setMembers([]);
  }

  const handleCopyOrder = () => {
    let copyText = '';
    members.forEach((member) => {
      copyText += `- ${member}\n`;
    });
    navigator.clipboard.writeText(copyText);
  }

  return (
    <CssVarsProvider>
      <Sheet 
        sx={{
          width: '50%',
          mx: 'auto',
          my: 4,
          py: 3,
          px: 2,
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div>
            <Typography level="h4" component="h1">
              Daily Stand Up Console
            </Typography>
          </div>
          <div>
            <Textarea 
              minRows={2} 
              placeholder='Add Team Members (comma separated) name1, name2, name3' 
              sx={{mb: 2} } 
              value={memberString}
              onChange={handleInputChange}></Textarea>
            <Button onClick={handleAddMember} sx={{mr: 1}}>add</Button>
            <Button onClick={clearCache}>clear</Button>
          </div>
          {showGrid && (
          <>
            <Divider />
            <List sx={{mt: 2}}>
              {members.map((member) => (
                <ListItem key={member}>
                  <ListItemButton>
                    <Avatar sx={{mr: 2}}>{(member[0]+member[1]).toUpperCase()}</Avatar>
                    <ListItemContent>{member}</ListItemContent>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <div>
              <Button sx={{mt: 2}} onClick={randomize}>Randomize</Button>
              <Button sx={{mt: 2, ml: 1}} onClick={handleCopyOrder}>Copy Order</Button>
            </div>
          </>
          ) }

        </Sheet>
    </CssVarsProvider>
  );
}

export default App;
