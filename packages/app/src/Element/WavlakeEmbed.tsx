const WavlakeEmbed = ({ link }: { link: string }) => {
  const convertedUrl = link.replace("player.wavlake.com", "embed.wavlake.com");

  return (
    <iframe
      style={{ borderRadius: 12 }}
      src={convertedUrl}
      width="100%"
      height="400"
      frameBorder="0"
      allow=""
      loading="lazy"></iframe>
  );
};

export default WavlakeEmbed;
