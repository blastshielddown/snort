import "./ProfileImage.css";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HexKey, NostrPrefix } from "@snort/nostr";

import { useUserProfile } from "Hooks/useUserProfile";
import { hexToBech32, profileLink } from "Util";
import Avatar from "Element/Avatar";
import Nip05 from "Element/Nip05";
import { MetadataCache } from "Cache";
import usePageWidth from "Hooks/usePageWidth";

export interface ProfileImageProps {
  pubkey: HexKey;
  subHeader?: JSX.Element;
  showUsername?: boolean;
  className?: string;
  link?: string;
  autoWidth?: boolean;
  defaultNip?: string;
  verifyNip?: boolean;
  linkToProfile?: boolean;
  overrideUsername?: string;
}

export default function ProfileImage({
  pubkey,
  subHeader,
  showUsername = true,
  className,
  link,
  autoWidth = true,
  defaultNip,
  verifyNip,
  linkToProfile = true,
  overrideUsername,
}: ProfileImageProps) {
  const navigate = useNavigate();
  const user = useUserProfile(pubkey);
  const nip05 = defaultNip ? defaultNip : user?.nip05;
  const width = usePageWidth();

  const name = useMemo(() => {
    return overrideUsername ?? getDisplayName(user, pubkey);
  }, [user, pubkey, overrideUsername]);

  if (!pubkey && !link) {
    link = "#";
  }

  const onAvatarClick = () => {
    if (linkToProfile) {
      navigate(link ?? profileLink(pubkey));
    }
  };

  return (
    <div className={`pfp f-ellipsis${className ? ` ${className}` : ""}`} onClick={onAvatarClick}>
      <div className="avatar-wrapper">
        <Avatar user={user} />
      </div>
      {showUsername && (
        <div className="profile-name">
          <div className="username">
            <div className="display-name">
              <div>{name.trim()}</div>
              {nip05 && <Nip05 nip05={nip05} pubkey={pubkey} verifyNip={verifyNip} />}
            </div>
          </div>
          <div className="subheader" style={{ width: autoWidth ? width - 190 : "" }}>
            {subHeader}
          </div>
        </div>
      )}
    </div>
  );
}

export function getDisplayName(user: MetadataCache | undefined, pubkey: HexKey) {
  let name = hexToBech32(NostrPrefix.PublicKey, pubkey).substring(0, 12);
  if (typeof user?.display_name === "string" && user.display_name.length > 0) {
    name = user.display_name;
  } else if (typeof user?.name === "string" && user.name.length > 0) {
    name = user.name;
  }
  return name;
}
